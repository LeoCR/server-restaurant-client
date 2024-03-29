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
module.exports = (app, express, path) => {
  const publicController = require(path.resolve(
    __dirname + "/../db/controller/public.controller.js"
  ));
  const transporter = nodemailer.createTransport({
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
  app.post("/submit/contact-form", (req, res) => {
    if (
      (req.body.fullName !== "") & (req.body.phoneNumber !== "") &&
      req.body.email !== "" &&
      req.body.comment !== ""
    ) {
      let message = "<h4>Full Name:</h4><p>" + req.body.fullName + "</p>";
      message += "<h4>Telephone:</h4><p>" + req.body.phoneNumber + "</p>";
      message += "<h4>Email:</h4><p>" + req.body.email + "</p>";
      message += "<h4>Comment:</h4><p>" + req.body.comment + "</p>";
      const mailOptions = {
        from: "restaurantnodejscr@gmail.com",
        to: "restaurantnodejscr@gmail.com",
        subject: "Restaurant Contact Form",
        html: message,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.send(req.body);
        }
      });
    } else {
      res.send({ contact: null });
    }
  });
  app.use(
    "/img/",
    express.static(
      path.resolve(__dirname + "/../../../../react-admin-restaurant/img")
    )
  );
  app.get(["/", "/drinks/:id", "/saucers/:id"], (req, res) => {
    res
      .status(200)
      .sendFile(
        path.resolve(
          __dirname +
            "/../../../../react-redux-shopping-cart-restaurant/build/index.html"
        )
      );
  });
  app.use(
    "/",
    express.static(
      path.resolve(
        __dirname + "/../../../../react-redux-users-restaurant/build/"
      )
    )
  );
  app.get("/api/getProducts", publicController.getAllProducts);
  app.get("/api/product/:id", publicController.findProduct);
  app.get("/api/product/ingredients/:id", publicController.findIngredients);
  app.use(
    "/static/",
    express.static(
      path.resolve(
        __dirname + "/../../../../react-redux-checkout-restaurant/build/static/"
      )
    )
  );

  //app.use('/',express.static('/Users/leo/Documents/restaurant-public-template/'));
  app.use(
    "/fonts/",
    express.static(
      path.resolve(
        __dirname +
          "/../../../../react-redux-shopping-cart-restaurant/public/fonts/"
      )
    )
  );
  app.use(
    "/",
    express.static(
      path.resolve(
        __dirname + "/../../../../react-redux-shopping-cart-restaurant/build/"
      )
    )
  );
  app.use(
    "/css/",
    express.static(
      path.resolve(
        __dirname +
          "/../../../../react-redux-shopping-cart-restaurant/public/css/"
      )
    )
  );
  app.use(
    "/static/",
    express.static(
      path.resolve(
        __dirname +
          "/../../../../react-redux-shopping-cart-restaurant/public/static/"
      )
    )
  );
  app.use(
    "/images/",
    express.static(
      path.resolve(
        __dirname +
          "/../../../../react-redux-shopping-cart-restaurant/public/images/"
      )
    )
  );
  app.use(
    "/revolution/js/",
    express.static(
      path.resolve(
        __dirname +
          "/../../../../react-redux-shopping-cart-restaurant/public/revolution/js/"
      )
    )
  );
  app.use(
    "/revolution/css/",
    express.static(
      path.resolve(
        __dirname +
          "/../../../../react-redux-shopping-cart-restaurant/public/revolution/css/"
      )
    )
  );
  app.use(
    "/revolution/fonts/",
    express.static(
      path.resolve(
        __dirname +
          "/../../../../react-redux-shopping-cart-restaurant/public/revolution/fonts/"
      )
    )
  );
  app.use(
    "/revolution/assets/",
    express.static(
      path.resolve(
        __dirname +
          "/../../../../react-redux-shopping-cart-restaurant/public/revolution/assets/"
      )
    )
  );
  app.use(
    "/js/",
    express.static(
      path.resolve(
        __dirname +
          "/../../../../react-redux-shopping-cart-restaurant/public/js/"
      )
    )
  );
};
