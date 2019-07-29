module.exports = function(sequelize, Sequelize) {
    var User = sequelize.define('USER', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        firstname: {
            type: Sequelize.STRING,
            //notEmpty: true
        },
        lastname: {
            type: Sequelize.STRING,
            //notEmpty: true
        },
        username: {
            type: Sequelize.TEXT
        },
        about: {
            type: Sequelize.TEXT
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING//,
            //allowNull: false
        },
        last_login: {
            type: Sequelize.DATE
        },
        updated_at:{
            type:Sequelize.DATE
        },
        created_at:{
            type:Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        provider: {
            type: Sequelize.STRING
        },
        id_user: {
            type: Sequelize.STRING
        }
    });
    return User;
}