module.exports = function(app,path) {
    const strongDish = require(path.resolve(__dirname+'/../db/controller/strongDish.controller.js')); 
    // Retrieve all 
    app.get('/api/strongs-dishes', strongDish.findAll);
    app.get('/api/strong-dish/show/:id', strongDish.findById);
    
}