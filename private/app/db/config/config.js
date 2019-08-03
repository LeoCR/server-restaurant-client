const Sequelize = require('sequelize');
const path = require('path');
const sequelize = new Sequelize('restaurant_ui', 'root', '79461313', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: true,
    underscored: true,
    timestamps: false
},
  port: "3306",
  pool: {
    max: 5000,
    min: 0,
    acquire: 3000000,
    idle: 1000000
  }
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.entree = require(path.resolve(__dirname+'/../model/entree.model.js'))(sequelize, Sequelize);
db.strongDish = require(path.resolve(__dirname+'/../model/strongDish.model.js'))(sequelize, Sequelize);
db.ingredient = require(path.resolve(__dirname+'/../model/ingredient.model.js'))(sequelize, Sequelize);
db.dessert=require(path.resolve(__dirname+'/../model/dessert.model.js'))(sequelize, Sequelize);
db.user=require(path.resolve(__dirname+'/../model/user.model.js'))(sequelize, Sequelize);
db.drink=require(path.resolve(__dirname+'/../model/drink.model.js'))(sequelize, Sequelize);
db.invoiceDetail=require(path.resolve(__dirname+'/../model/invoiceDetail.model.js'))(sequelize,Sequelize);
db.headerInvoice=require(path.resolve(__dirname+'/../model/headerInvoice.model.js'))(sequelize,Sequelize);
db.reservation=require(path.resolve(__dirname+'/../model/reservation.model.js'))(sequelize,Sequelize);
module.exports = db;