module.exports = (sequelize, Sequelize) => {
    const HEADER_INVOICE = sequelize.define('HEADER_INVOICE', {
        id_header: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        total: Sequelize.DECIMAL,
        subtotal:  Sequelize.DECIMAL,
        sales_tax:Sequelize.DECIMAL,
        product_id:Sequelize.TEXT,
        product_name:Sequelize.TEXT,
        product_quantity:Sequelize.INTEGER
        },{
            timestamps: false
    });
	return HEADER_INVOICE;
}