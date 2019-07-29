module.exports = function(app,path) {
    const entree = require(path.resolve(__dirname+'/../db/controller/entree.controller.js')); 
    // Retrieve all 
    app.get('/api/entrees', entree.findAll);
    app.get('/api/entree/show/:id', entree.findById);
}