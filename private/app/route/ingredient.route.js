module.exports = function(app,path) {
    const ingredient = require(path.resolve(__dirname+'/../db/controller/ingredient.controller.js')); 
    // Retrieve all 
    app.get('/api/ingredients', ingredient.findAll);
    app.get('/api/ingredient/show/:id', ingredient.findById);
}