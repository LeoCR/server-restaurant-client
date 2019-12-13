const path = require('path'), 
db = require(path.resolve(__dirname+'/../config/config.js')),
User = db.user,
sequelize=db.sequelize;
exports.findByEmail=(req,res)=>{
    User.findOne({ attributes: ['id'],where: {email: req.params.email} }).then(user => {
        if(user){
            res.send(user)
        }
        else{
            res.json({user:null});
        }
    })  
}
exports.findById = (req, res) => {	
	User.findByPk(req.params.id).then(user => {
		res.send(user);
	})
};
exports.updateUser=(req,res)=>{
    User.update({  
        username: req.body.username,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email:req.body.email
    }, 
  { where: {email: req.body.email}}).then(user => {	
          res.status(200).send(user);
    }).catch(err => {
        console.log(err);
        res.status(500).json({msg: "error", details: err});
    });
}
exports.getUser=(req,res)=>{
    if(req.user){
        if(req.user._json){
            User.findOne({ where: {email: req.user.emails[0].value} }).then(user => {
                if(user){
                    res.send(user)
                }
                else{
                    res.json({user:null});
                }
            }) 
        }
        else{
            User.findOne({ where: {email: req.user.email} }).then(user => {
                if(user){
                    res.send(user)
                }
                else{
                    res.json({user:null});
                }
            }) 
        }
    }
    else{
      res.json({user:null})
    }
}