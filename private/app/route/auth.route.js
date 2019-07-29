module.exports = function(app, passport,path,User,jwt) {
    var authController = require(path.resolve(__dirname+'/../db/controller/auth.controller.js'));
    var secretKey='943rjkhsOA)JAQ@#';
    
    app.post('/api/signup', passport.authenticate('local-signup', {
            successRedirect: '/checkout',
            failureRedirect: '/'
        }
    ));
    app.get('/api/logout', authController.logout);
   
    app.post('/api/login', function(req, res, next) {
        passport.authenticate('local-signin', function(err, user, info) {
            /**
             * @see http://www.passportjs.org/docs/authenticate/
             */
            if (err) { 
                console.log('An error occurs');
                console.log(err);
            return next(err);
            }
            if (!user) { 
                return res.json({msg:"Incorrect credentials"}); 
            }
            req.logIn(user, function(err) {
            if (err) { 
                return next(err);
            }
            jwt.sign({user},secretKey,(err,token)=>{
                if(err){
                    return res.send({msg:"An error occurs on /api/login jwt.sign(): ",error:err});
                }
                else{
                    res.cookie("userData", {user,token}); 
                    return res.send({user,token});
                }
            });
        });
    })(req, res, next);
  });
}