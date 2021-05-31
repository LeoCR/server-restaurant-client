const {google} = require('googleapis')
const nodemailer = require("nodemailer");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID, // ClientID
  process.env.CLIENT_SECRET, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const accessToken = oauth2Client.getAccessToken(); 
const path = require('path'), 
db = require(path.resolve(__dirname+'/../config/config.js')),
Reservation = db.reservation, 
transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "restaurantnodejscr@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: accessToken,
  },
});
exports.create = (req, res) => {
    let id=0;
    if(req.body.fullName!=='' && req.body.phoneNumber!=='' 
    && req.body.email!==''&& req.body.date!==''){
        let message='<h4>Full Name:</h4><p>'+req.body.fullName+'</p>';
        message+='<h4>Telephone:</h4><p>'+req.body.phoneNumber+'</p>';
        message+='<h4>Email:</h4><p>'+req.body.email+'</p>';
        message+='<h4>Date of Reservation:</h4><p>'+ req.body.date+'</p>';
        message+='<h4>Time:</h4><p>'+req.body.time+'</p>';
        message+='<h4>Quantity of Persons:</h4><p>'+ req.body.persons+'</p>';
        message+='<h4>Comment:</h4><p>'+ req.body.comment+'</p>';
        message+='<p>Thanks for reserve with us.</p>'
        const mailOptions = {
            from: 'restaurantnodejscr@gmail.com',
            to: req.body.email,
            subject: 'Restaurant Reservation',
            html: message
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    }
    Reservation.count().then(c => {
        id=parseInt(c)+1;
        console.log("There are " + c + " projects!")
    }).then(()=>{
        Reservation.create({  
            id:id,
            full_name:req.body.fullName,
            telephone: req.body.phoneNumber,
            email:  req.body.email,
            date_of_reservation: req.body.date,
            hour_of_reservation:req.body.time,
            quantity_of_persons:req.body.persons,
            comment:req.body.comment
        }).then(reservation => {		
              console.log('reservation',reservation);
              res.status(200).send(reservation);
        }); 
    })
	
}