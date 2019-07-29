module.exports = function(app,path) {
    const user = require(path.resolve(__dirname+'/../db/controller/user.controller.js')); 
    app.get('/api/find/email/:email', user.findByEmail);
    app.get('/api/user/info',user.getUser);
    app.put('/api/user/update/:email',user.updateUser)
}