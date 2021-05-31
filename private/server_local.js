const express = require('express'),
path = require('path'), 
app = express(),
bodyParser = require('body-parser'),
compression = require('compression'),
methodOverride = require('method-override'),
exphbs  = require('express-handlebars'),
passport = require('passport'),
cors = require('cors'),
session = require('express-session'),
FacebookStrategy= require('passport-facebook'),
GoogleStrategy = require( 'passport-google-oauth2' ).Strategy,
fs = require('fs'),
https = require('https'),
db = require(path.resolve(__dirname+'/app/db/config/config.js')),
User = db.user,
cookieParser = require('cookie-parser'),

paypal = require('@paypal/checkout-server-sdk');
require("dotenv").config();
const clientPaypalId = process.env.PAYPAL_CLIENT_ID,
clientPaypalSecret = process.env.PAYPAL_CLIENT_SECRET,
environment = new paypal.core.SandboxEnvironment(clientPaypalId, clientPaypalSecret),
client = new paypal.core.PayPalHttpClient(environment),
secretKey=process.env.LOCAL_SECRET_KEY;
const PORT = process.env.PORT||49652;
const fbOpts={
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "https://localhost:"+PORT+"/auth/facebook/callback",
  enableProof: true,
  profileFields: ['id', 'displayName', 'photos', 'emails','first_name', 'last_name']
};
const googleOpts={
    clientID:process.env.GMAIL_CLIENT_ID,
    clientSecret:process.env.GMAIL_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback : true
};
const googleCallback=(request, accessToken, refreshToken, profile, done)=> { 
  const email=profile.email; 
  if(email!==''||email!==undefined){
    const dateTime = new Date();
    User.findOne({ where: {email} }).then(user => {
      if(user){
        User.update({
          last_login: dateTime,
          provider:'google'
        }, 
        { where: {email}}); 
      }
      else{
        User.create({  
          username: profile.displayName,
          firstname:profile.name.givenName,
          lastname:profile.name.familyName,
          provider:'google',
          id_user:profile.id,
          email:email,
          created_at:dateTime,
          updated_at:dateTime
        }) 
      }
    });
  }
  done(null, profile);
};
const fbCallback=(accessToken, refreshToken, profile, done) =>{ 
  const email=profile.emails[0].value; 
  if(email!==''||email!==undefined){
    const dateTime = new Date();
    User.findOne({ where: {email} }).then(user => {
      if(user){
        User.update({
          provider:'facebook',
          last_login: dateTime
        }, 
        { where: {email}}); 
      }
      else{
        User.create({  
          username: profile._json.name,
          firstname:profile._json.firstname,
          lastname:profile._json.last_name,
          provider:'facebook',
          id_user:profile.id,
          email:email,
          created_at:dateTime,
          updated_at:dateTime
        }); 
      }
    })
  } 
  done(null, profile);
};
//Models
const models = require(path.resolve(__dirname+"/app/db/config/config.js"));
const isLoggedIn=(req, res, next)=> {
  if (req.isAuthenticated()){
      return next();
  }
  else{
      res.redirect('/');
  }
}
app.use(cors());
app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser()); 
// For Passport
app.use(session({
  secret: secretKey,
  resave: true,
  saveUninitialized: true, 
  maxAge: Date.now() + (30 * 86400 * 1000)
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new FacebookStrategy(fbOpts,fbCallback)); 
passport.use(new GoogleStrategy(googleOpts,googleCallback));
app.get('/auth/google/callback',
  passport.authenticate('google', { 
    scope:[ 'profile','https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'],
    successRedirect: '/checkout',
    failureRedirect: '/'
  }
));
/* 
  Facebook will redirect the user to this URL after approval.  Finish the
authentication process by attempting to obtain an access token.  If
access was granted, the user will be logged in.  Otherwise,
authentication has failed.
*/
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect: '/checkout',
    failureRedirect: '/',scope: ["email"] }
));
app.use(compression());
app.use(methodOverride());
app.use((err, req, res, next) =>{
  res.send('An error occurs: '+err);
});

app.set('views', path.resolve(__dirname+'/app/views'))
app.engine('html', exphbs({
    extname: '.html'
}));
app.set('view engine', '.html');
app.get('/api/validate/authentication',(req,res)=>{
  if (req.isAuthenticated()){
    res.json({isAuthenticated:true});
  }
  else{
    res.json({isAuthenticated:false});
  }
});

app.post('/api/pay-with-paypal',async(req,res)=>{
  // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
  let request = new paypal.orders.OrdersCreateRequest();
  // Construct a request object and set desired parameters
  request.requestBody({
      "intent": "CAPTURE",
      "application_context": {
          "return_url": "https://localhost:"+PORT+"/paypal/payment/success",
          "cancel_url": "https://localhost:"+PORT+"/paypal/cancel",
          "brand_name": "React Redux Node-JS Restaurant",
          "locale": "en-US",
          "landing_page": "BILLING",
          "shipping_preference": "NO_SHIPPING",
          "user_action": "PAY_NOW"
      },
      "purchase_units": [
          {
              "reference_id": "ReactReduxRestaurant",
              "description": "Food of Restaurant",
              "custom_id": "Food",
              "soft_descriptor": "FoodOfRestaurant",
              "amount": {
                  "currency_code": "USD",
                  "value": req.body.subtotal,
                  "breakdown": {
                      "item_total": {
                          "currency_code": "USD",
                          "value": req.body.item_total
                      },
                      "shipping": {
                          "currency_code": "USD",
                          "value": "0"
                      },
                      "tax_total": {
                          "currency_code": "USD",
                          "value":req.body.tax_total
                      },
                      "shipping_discount": {
                          "currency_code": "USD",
                          "value": "0"
                      }
                  }
              },
              "items":req.body.items
          }
      ]
  });
  let TempData;
  // Call API with your client and get a response for your call
  try {
    let response = await client.execute(request);
    TempData={
      id:response.result.id,
      data:response.result.links[1]
    }; 
    return res.send(TempData)
  } 
  catch (error) {
    return res.send(error);
  }
});
app.get('/paypal/payment/success',(req,res)=>{
  const payerId=req.query.PayerID,
  paypalToken=req.query.token;
  try { 
      let captureOrder =  async function(orderId) {
          const request = new paypal.orders.OrdersCaptureRequest(orderId);
          request.requestBody({});
          // Call API with your client and get a response for your call
          let response = await client.execute(request).then((res)=>{
            return res;
          })
          .catch((e)=>{
            console.log("An error occurs");
            return e; 
          });
          return response;
      }
      if(req.cookies.paypal_id!==undefined&&payerId!==undefined&&paypalToken!==undefined){
          captureOrder(req.cookies.paypal_id);
          res.status(200).sendFile(path.resolve(__dirname+'/../../react-redux-checkout-restaurant/build/index.html'));
      }
      else{
          return res.send('Sorry this page is unavailable')
      } 
  } catch (error) {
    return res.send(error);
  }   
});
app.get('/paypal/cancel',(req,res)=>{
  res.send('Cancelled')
});
require(path.resolve(__dirname+'/app/route/public.route.js'))(app,express,path);
require(path.resolve(__dirname+'/app/route/private.route.js'))(app,path,isLoggedIn);
require(path.resolve(__dirname+'/app/route/strongDish.route.js'))(app,path);
require(path.resolve(__dirname+'/app/route/entree.route.js'))(app,path);
require(path.resolve(__dirname+'/app/route/ingredient.route.js'))(app,path);
require(path.resolve(__dirname+'/app/route/dessert.route.js'))(app,path);
require(path.resolve(__dirname+'/app/route/user.route.js'))(app,path);
require(path.resolve(__dirname+'/app/route/invoice.route.js'))(app,path);
require(path.resolve(__dirname+'/app/route/reservation.route.js'))(app,path);
//load passport strategies
require(path.resolve(__dirname+'/app/db/config/passport/passport.js'))(passport, models.user);
require(path.resolve(__dirname+'/app/route/auth.route.js'))(app,passport,path); 
app.route('/logout').get((req,res)=>{
    req.session.destroy();
    req.logout();
    res.redirect('/');
})
/**
 * https Options
 * @see https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec
 */
const httpsOptions = {
    key: fs.readFileSync('/Users/leo/Documents/server-restaurant-admin/private/security/server.key'),
    cert: fs.readFileSync('/Users/leo/Documents/server-restaurant-admin/private/security/server.crt')
}
//Sync Database
models.sequelize.sync().then(function() {
    console.log('https://localhost:'+PORT+' works')
}).catch((err)=> {
    console.log(err, "Something went wrong with the Database!")
});

https.createServer(httpsOptions,app, (req, res) => {
    res.set({
      'Access-Control-Allow-Credentials': true,
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Content-Type-Options':'nosniff',
      'Vary':'Origin, Accept-Encoding',
      'Pragma':'no-cache',
      'Expires':-1
    })
    res.writeHead(200);
    res.end('hello world\n');
    console.log('https://localhost:'+PORT+' !');
}).listen(PORT); 
