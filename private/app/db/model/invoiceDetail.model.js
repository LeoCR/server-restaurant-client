module.exports = (sequelize, Sequelize) => {
    const INVOICE_DETAIL = sequelize.define('INVOICE_DETAIL', {
        id_invoice_detail: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        client_restaurant:Sequelize.INTEGER,
        header_invoice: Sequelize.INTEGER,
        order_code:Sequelize.STRING,
        date_of_billing:Sequelize.DATE,
        paypal_id:Sequelize.STRING,
        paypal_payer_id:Sequelize.STRING,
        paypal_token:Sequelize.STRING
        },{
            timestamps: false,
            freezeTableName: true,
            underscored: true
    });
	return INVOICE_DETAIL;
}