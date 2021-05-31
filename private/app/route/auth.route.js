module.exports = function(app, passport,path) {
    const authController = require(path.resolve(__dirname+'/../db/controller/auth.controller.js'));
    
    app.post('/api/signup', passport.authenticate('local-signup', {
            successRedirect: '/checkout',
            failureRedirect: '/'
        }
    ));
    app.get('/api/logout', authController.logout);
   
    app.post('/api/login', (req, res, next)=> {
        passport.authenticate('local-signin', (err, user, info)=> {
            /**
             * @see http://www.passportjs.org/docs/authenticate/
             */
            if (err) { 
                console.log('An error occurs');
                console.log(err);
            return next(err);
            }
            if (!user) { 
                return res.json({msg:"Incorrect credentials",info}); 
            }
            req.logIn(user, function(err) {
                if (err) { 
                    return next(err);
                } 
                return res.send({user});
            });
    })(req, res, next);
  });
}