module.exports = (sequelize, Sequelize) => {
    const DRINK = sequelize.define('DRINK', {
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
	return DRINK;
}