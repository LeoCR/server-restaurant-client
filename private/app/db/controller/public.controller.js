const path = require('path'), 
db = require(path.resolve(__dirname+'/../config/config.js')),
Drink = db.drink,
Dessert = db.dessert,
StrongDish = db.strongDish,
Entree = db.entree,
sequelize=db.sequelize;
exports.getAllProducts= (req, res) => {
    var jsonData={};
    Drink.findAll().then(drink => {
        jsonData={ drinks: drink };  
    }).then(()=>{
        Dessert.findAll().then(dessert => {
            jsonData=Object.assign({desserts:dessert},jsonData);
        }).then(()=>{
            StrongDish.findAll().then(strongDish => {
                jsonData=Object.assign({strongsDishes:strongDish},jsonData);
            });
        }).then(()=>{
            Entree.findAll().then(entree => {
                jsonData=Object.assign({entrees:entree},jsonData);
                res.send(jsonData);
            });
        })
    });
};
//
// Find a Product by Id
exports.findIngredients = (req, res) => {	
    var idDish=req.params.id,
    sqlFindIngredients="SELECT INGREDIENT.id,INGREDIENT.name,"+
   " INGREDIENT.img,INGREDIENT_DISH.id_ingredient,"+
   " INGREDIENT_DISH.id_dish FROM INGREDIENT JOIN INGREDIENT_DISH "+
   " ON INGREDIENT.id = INGREDIENT_DISH.id_ingredient "+
   " WHERE INGREDIENT_DISH.id_dish='"+idDish+"';";
   sequelize.query(sqlFindIngredients, { type: sequelize.QueryTypes.SELECT})
   .then(ingredients => {
        res.send(ingredients);     
    })
}
// Find a Product by Id
exports.findProduct = (req, res) => {	
    var idProduct=req.params.id;
    if(idProduct.includes('DRK')){
        Drink.findByPk(idProduct).then(drink => {
            res.send(drink);
        });
    }
    else if(idProduct.includes('DESRT')){
        Dessert.findByPk(idProduct).then(dessert => {
            res.send(dessert);
        });
    }
	else if(idProduct.includes('BGD')){
        StrongDish.findByPk(idProduct).then(strongDish => {
            res.send(strongDish);
        });
    }
    else if(idProduct.includes('ENTR')){
        Entree.findByPk(idProduct).then(entree => {
            res.send(entree);
        });
    }
};
