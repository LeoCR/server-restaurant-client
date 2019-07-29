module.exports = (sequelize, Sequelize) => {
    const DESSERT = sequelize.define('DESSERT', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name:Sequelize.STRING,
        description: Sequelize.STRING,
        picture:  Sequelize.STRING,
        price:Sequelize.DECIMAL
        },{
            timestamps: false
    });
	return DESSERT;
}