module.exports = function(app,path) {
    const drink = require(path.resolve(__dirname+'/../db/controller/drink.controller.js')); 
    // Retrieve all 
    app.get('/api/drinks', drink.findAll);
    app.get('/api/drink/show/:id', drink.findById);
}