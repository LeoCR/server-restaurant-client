const bCrypt = require('bcrypt-nodejs');
module.exports = (passport, user)=> {
    /**
    * @see https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
    **/
    const User = user;
    const LocalStrategy = require('passport-local').Strategy;
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        (req, email, password, done)=> {
            const generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            User.findOne({
                where: {
                    email: email
                }
            }).then((user)=>{
                if (user){
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } else{
                    const userPassword = generateHash(password);
                    const data =
                        {
                            email: email,
                            password: userPassword,
                            username:req.body.username,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            provider:'system'
                        };
                    User.create(data).then((newUser, created)=>{
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
    //serialize
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // deserialize user 
    passport.deserializeUser(function(id, done) {
        User.findByPk(id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        (req, email, password, done)=>{
            const User = user;
            const isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
            User.findOne({
                where: {
                    email: email
                }
            }).then((user)=> {
                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                const userinfo = user.get();
                return done(null, userinfo);
            }).catch((err)=>{
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));
}