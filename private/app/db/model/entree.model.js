module.exports = (sequelize, Sequelize) => {
    const ENTREE = sequelize.define('ENTREE', {
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
	return ENTREE;
}