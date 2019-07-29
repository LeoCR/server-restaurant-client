module.exports = (sequelize, Sequelize) => {
    const STRONG_DISH = sequelize.define('STRONG_DISH', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name:Sequelize.STRING,
        description: Sequelize.STRING,
        picture:  Sequelize.STRING,
        category: Sequelize.STRING,
        price:Sequelize.DECIMAL
        },{
            timestamps: false
    });
	return STRONG_DISH;
}