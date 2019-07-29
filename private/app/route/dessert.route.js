module.exports = function(app,path) {
    const dessert = require(path.resolve(__dirname+'/../db/controller/dessert.controller.js')); 
    // Retrieve all 
    app.get('/api/desserts', dessert.findAll);
    app.get('/api/dessert/show/:id', dessert.findById);
}