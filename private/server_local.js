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
//paypal = require('paypal-rest-sdk'),
jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser'); 
var secretKey='943rjkhsOA)JAQ@#';
/*
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AT20D6Vyit9Nlal8G1lic-3t8cBO51TBfeQC3ZIWUlvbBcW9pealAB9ORvnLGI42eYf4qs03xr5eX9r3',
  'client_secret': 'ELFcF3ADCUW6rmdSMC5JNIvUYwn8V9VYPHVqOy58V2ORWrqqbP1CKv2Kw1vX_NE2_br-7GyRHIShpRV5'
});*/
var fbOpts={
  clientID: '1000175700179103',
  clientSecret: 'a9a5309580a601253cd18a4d23bfdf26',
  callbackURL: "https://localhost:49652/auth/facebook/callback",
  enableProof: true,
  profileFields: ['id', 'displayName', 'photos', 'emails','first_name', 'last_name']
};
var googleOpts={
    clientID:"309759265514-0eq8pofu7m5066l0bhbctsf1fc5j0t6q.apps.googleusercontent.com",
    clientSecret:"-K862ptYDMCBVqjY9lW7n406",
    callbackURL: "/auth/google/callback",
    passReqToCallback : true
};

var googleCallback=function(request, accessToken, refreshToken, profile, done) {
  console.log('profile GoogleStrategy');
  var email=profile.email;
  console.log(profile);
  if(email!==''||email!==undefined){
    var dateTime = new Date();
    User.findOne({ where: {email} }).then(user => {
      if(user){
        User.update({
          last_login: dateTime,
          provider:'google'
        }, 
        { where: {email:email}}).then(userUpdated => {		
          // Send created customer to client
          console.log('userUpdated');
          console.log(userUpdated);
        }); 
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
        }).then(userCreated => {		
          console.log('userCreated');  
          console.log(userCreated);
        }); 
      }
    });
  }
  done(null, profile);
};
var fbCallback=function(accessToken, refreshToken, profile, done) {
  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);
  console.log('profile',profile);
  var email=profile.emails[0].value;
  console.log('profile.emails[0].value '+email);
  if(email!==''||email!==undefined){
    var dateTime = new Date();
    User.findOne({ where: {email} }).then(user => {
      if(user){
        User.update({
          provider:'facebook',
          last_login: dateTime
        }, 
        { where: {email:email}}).then(userUpdated => {		
          // Send created customer to client
          console.log('userUpdated');
          console.log(userUpdated);
        }); 
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
        }).then(userCreated => {		
          console.log('userCreated');  
          console.log(userCreated);
        }); 
      }
    })
  } 
  done(null, profile);
};
//Models
var models = require(path.resolve(__dirname+"/app/db/config/config.js"));
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
      return next();
  }
  else{
      res.redirect('/');
  }
}
app.use(cors());
app.use(function(req, res, next) {
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
    successRedirect: '/user',
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
    successRedirect: '/user',
    failureRedirect: '/',scope: ["email"] }
));
app.use(compression());
app.use(methodOverride());
app.use(function(err, req, res, next) {
  res.send('An error occurs: '+err);
});

app.set('views', path.resolve(__dirname+'/app/views'))
app.engine('html', exphbs({
    extname: '.html'
}));
app.set('view engine', '.html');
app.get('/api/validate/authentication',function(req,res){
  if (req.isAuthenticated()){
    res.json({isAuthenticated:true});
  }
  else{
    res.json({isAuthenticated:false});
  }
});
//https://developer.paypal.com/docs/api/payments/v1/#definition-details
//https://developer.paypal.com/docs/api/payments/v1/#definition-amount
var tempTotal=0;
/*
app.post('/api/pay-with-paypal',(req,res)=>{
  const create_payment_json = {
    "intent": "order",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "https://localhost:49652/paypal/success",
        "cancel_url": "https://localhost:49652/paypal/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": req.body.items
        },
        "amount": {
            "currency": "USD",
            "total": req.body.total,
            "details":{
              "subtotal": req.body.subtotal,
              "tax": req.body.tax,
              "shipping": req.body.shipping
            }
        },
        "description": "Hat for the best team ever."
    }]
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log('An error occurs in  paypal.payment.create');
      console.log(error);
      res.send(error);
    } else {
      tempTotal=req.body.total;
        for(let i =0;i<payment.links.length;i++){
            if(payment.links[i].rel==='approval_url'){
              res.json(payment.links[i].href+"&total="+req.body.total);
            }
        }
    } 
  });
});
app.get('/paypal/success',(req,res)=>{
    const payerId=req.query.PayerID,
    paymentId=req.query.paymentId;
    var execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": tempTotal
          }
      }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log('An error occurs in  paypal.payment.create');
        console.log(error);
        res.send(error);
      } else {
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          res.send(payment);
      }
  });
});
app.get('/paypal/cancel',(req,res)=>{
  res.send('Cancelled')
});
*/
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
require(path.resolve(__dirname+'/app/route/auth.route.js'))(app,passport,path,User,jwt); 
app.route('/logout').get(function(req,res){
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
    console.log('https://localhost:49652 works')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});

const server=https.createServer(httpsOptions,app, (req, res) => {
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
    console.log('https://localhost:49652 !');
}).listen(49652); 
