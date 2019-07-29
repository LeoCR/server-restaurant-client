const path = require('path'), 
db = require(path.resolve(__dirname+'/../config/config.js')),
Ingredient = db.ingredient;
// FETCH all Customers
exports.findAll = (req, res) => {
	Ingredient.findAll({
		order: [
      ['name', 'ASC'],
    ]
	}).then(ingredient => {
	  // Send all customers to Client
	  res.send(ingredient);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
};
// Delete a Customer by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	Ingredient.destroy({
			where: { id: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> Ingredient Id = '  } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
exports.findById = (req, res) => {	
	Ingredient.findByPk(req.params.id).then(ingredient => {
		res.send(ingredient);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
};
// Post a Customer
exports.create = (req, res) => {
	Ingredient.create({  
		id: req.body.id,
		name: req.body.name,
		img: '/img/uploads/'+req.file.originalname
		 
	}).then(ingredient => {		
		  // Send created 
		  res.status(200).send(ingredient);
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
	//res.status(200).redirect('/admin');
}
// Update a Customer
exports.update = (req, res) => {
  	Ingredient.update({  
		id: req.body.id,
		name: req.body.name,
		img:req.body.img
	}, 
		{ 
			where: {
				id: req.body.id
		}}).then(ingredient => {		
		// Send created customer to client
		res.status(200).send(ingredient);
		
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
	//res.status(200).redirect('/admin');
};
// Update a Customer
exports.updateImg = (req, res) => {
	Ingredient.update({  
	  id: req.body.id,
	  name: req.body.name,
	  img: '/img/uploads/'+req.file.originalname  
  }, 
	  { 
		  where: {
			  id: req.body.id
	  }}).then(ingredient => {		
	  // Send created customer to client
	  res.status(200).send(ingredient);
	  
  }).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
  //res.status(200).redirect('/admin');
};