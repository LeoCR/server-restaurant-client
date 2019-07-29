const path = require('path'), 
db = require(path.resolve(__dirname+'/../config/config.js')),
sequelize=db.sequelize,
Drink = db.drink;
// FETCH all Customers
exports.findAll = (req, res) => {
	Drink.findAll().then(drink => {
	  // Send all customers to Client
	  res.send(drink);
	});
};
// Delete a Customer by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	Drink.destroy({
			where: { id: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> Drink Id = '  } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
// Post a Customer
exports.create = (req, res) => {	
  Drink.create({  
		id: req.body.id,
		name: req.body.name,
		description: req.body.description,
		picture:'/img/uploads/'+req.file.originalname,
		price:req.body.price 
	}).then(drink => {		
		  // Send created customer to client
		  res.status(200).send(drink);
	}); 
	//res.status(200).redirect('/admin');
};
// Find a Customer by Id
exports.findById = (req, res) => {	
	Drink.findByPk(req.params.id).then(drink => {
		res.send(drink);
	})
};
// Update a Customer
exports.update = (req, res) => {
	Drink.update({  
		  id: req.body.id,
		  name: req.body.name,
		  description: req.body.description,
		  picture:req.body.picture,
		  price:req.body.price 
	  }, 
	{ where: {id: req.body.id}}).then(drink => {		
			// Send created customer to client
			res.status(200).send(drink);
	  }); 
	  res.status(200).redirect('/admin');
};
// Update a Customer
exports.updateImg = (req, res) => {
  Drink.update({  
		id: req.body.id,
		name: req.body.name,
		description: req.body.description,
		picture:'/img/uploads/'+req.file.originalname,
		price:req.body.price 
	}, 
  { where: {id: req.body.id}}).then(drink => {		
		  // Send created customer to client
		  res.status(200).send(drink);
	}); 
	res.status(200).redirect('/admin');
};