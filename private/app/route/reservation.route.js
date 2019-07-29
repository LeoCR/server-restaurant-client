module.exports = function(app,path) {
    const reservation = require(path.resolve(__dirname+'/../db/controller/reservation.controller.js')); 
    app.post('/submit/reservation-form',reservation.create);
}