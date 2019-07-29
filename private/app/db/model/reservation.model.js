module.exports = (sequelize, Sequelize) => {
    const RESERVATION = sequelize.define('RESERVATION', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        full_name:Sequelize.STRING,
        telephone: Sequelize.STRING,
        email:  Sequelize.STRING,
        date_of_reservation: Sequelize.DATE,
        hour_of_reservation:Sequelize.STRING,
        quantity_of_persons:Sequelize.INTEGER,
        comment:Sequelize.STRING
        },{
            timestamps: false
    });
	return RESERVATION;
}