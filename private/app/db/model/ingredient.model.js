module.exports = (sequelize, Sequelize) => {
    const INGREDIENT = sequelize.define('INGREDIENT', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name:Sequelize.STRING,
        img: Sequelize.STRING
        },{
            timestamps: false
    });
	return INGREDIENT;
}