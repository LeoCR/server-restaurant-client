const path = require('path'), 
db = require(path.resolve(__dirname+'/../config/config.js')),
Dessert = db.dessert;
// FETCH all Desserts
exports.findAll = (req, res) => {
	Dessert.findAll().then(dessert => {
	  // Send all customers to Client
	  res.send(dessert);
	});
};
// Delete a Dessert by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	Dessert.destroy({
			where: { id: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> StrongDish Id = '  } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
// Post a Dessert
exports.create = (req, res) => {	
    Dessert.create({  
		id: req.body.id,
		name: req.body.name,
		description: req.body.description,
		picture:'/img/uploads/'+req.file.originalname,
		price:req.body.price 
	}).then(strongDish => {		
		  // Send created customer to client
		  res.status(200).send(strongDish);
	}); 
	//res.status(200).redirect('/admin');
};
// Find a Dessert by Id
exports.findById = (req, res) => {	
	Dessert.findByPk(req.params.id).then(dish => {
		res.send(dish);
	})
};
// Update a Dessert
exports.update = (req, res) => {
	Dessert.update({  
		  id: req.body.id,
		  name: req.body.name,
		  description: req.body.description,
		  picture:req.body.picture,
		  price:req.body.price 
	  }, 
	{ where: {id: req.body.id}}).then(dessert => {		
			// Send created customer to client
			res.status(200).send(dessert);
	  }); 
	  //res.status(200).redirect('/admin');
};
// Update a Dessert
exports.updateImg = (req, res) => {
    Dessert.update({  
		id: req.body.id,
		name: req.body.name,
		description: req.body.description,
		picture:'/img/uploads/'+req.file.originalname,
		price:req.body.price 
	}, 
  { where: {id: req.body.id}}).then(dessert => {		
		  // Send created customer to client
		  res.status(200).send(dessert);
	}); 
	//res.status(200).redirect('/admin');
};