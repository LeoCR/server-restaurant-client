const path = require('path'), 
db = require(path.resolve(__dirname+'/../config/config.js')),
StrongDish = db.strongDish;
// FETCH all Customers
exports.findAll = (req, res) => {
	StrongDish.findAll().then(strongDish => {
	  // Send all customers to Client
	  res.send(strongDish);
	});
};
// Delete a Customer by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	StrongDish.destroy({
			where: { id: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> StrongDish Id = '  } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
// Post a Customer
exports.create = (req, res) => {	
  StrongDish.create({  
		id: req.body.id,
		name: req.body.name,
		description: req.body.description,
		picture:'/img/uploads/'+req.file.originalname,
		category:req.body.category,
		price:req.body.price 
	}).then(strongDish => {		
		  // Send created customer to client
		  res.status(200).send(strongDish);
	}); 
	//res.status(200).redirect('/admin');
};
// Find a Customer by Id
exports.findById = (req, res) => {	
	StrongDish.findByPk(req.params.id).then(dish => {
		res.send(dish);
	})
};
// Update a Customer
exports.update = (req, res) => {
	StrongDish.update({  
		  id: req.body.id,
		  name: req.body.name,
		  description: req.body.description,
		  picture:req.body.picture,
		  category:req.body.category,
		  price:req.body.price 
	  }, 
	{ where: {id: req.body.id}}).then(strongDish => {		
			// Send created customer to client
			res.status(200).send(strongDish);
	  }); 
	  res.status(200).redirect('/admin');
};
// Update a Customer
exports.updateImg = (req, res) => {
  StrongDish.update({  
		id: req.body.id,
		name: req.body.name,
		description: req.body.description,
		picture:'/img/uploads/'+req.file.originalname,
		category:req.body.category,
		price:req.body.price 
	}, 
  { where: {id: req.body.id}}).then(strongDish => {		
		  // Send created customer to client
		  res.status(200).send(strongDish);
	}); 
	res.status(200).redirect('/admin');
};