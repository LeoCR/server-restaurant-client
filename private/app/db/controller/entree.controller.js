const path = require('path'), 
db = require(path.resolve(__dirname+'/../config/config.js')),
Entree = db.entree;
// FETCH all Customers
exports.findAll = (req, res) => {
	Entree.findAll().then(entree => {
	  // Send all customers to Client
	  res.send(entree);
	});
};
// Delete a Customer by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	Entree.destroy({
			where: { id: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> Entree Id = '  } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
exports.findById = (req, res) => {	
	Entree.findByPk(req.params.id).then(dish => {
		res.send(dish);
	})
};
// Post a Customer
exports.create = (req, res) => {
	Entree.create({  
		id: req.body.id,
		name: req.body.name,
		description: req.body.description,
		picture:'/img/uploads/'+req.file.originalname,
		category:req.body.category,
		price:req.body.price 
	}).then(entree => {		
		  // Send created 
		  res.status(200).send(entree);
	}); 
	res.status(200).redirect('/admin/');
}
// Update a Customer
exports.update = (req, res) => {
  	Entree.update({  
		id: req.body.id,
		name: req.body.name,
		description: req.body.description,
		picture:req.body.picture,
		category:req.body.category,
		price:req.body.price
	}, 
		{ 
			where: {
				id: req.body.id
		}}).then(entree => {		
		// Send created customer to client
		res.status(200).send(entree);
		
	});
	res.status(200).redirect('/admin/');
};
// Update a Customer
exports.updateImg = (req, res) => {
	Entree.update({  
	  id: req.body.id,
	  name: req.body.name,
	  description: req.body.description,
	  picture:'/img/uploads/'+req.file.originalname,
	  category:req.body.category,
	  price:req.body.price
  }, 
	  { 
		  where: {
			  id: req.body.id
	  }}).then(entree => {		
	  // Send created customer to client
	  res.status(200).send(entree);
	  
  });
  res.status(200).redirect('/admin/');
};