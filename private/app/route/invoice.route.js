module.exports = function(app,path) {
    const invoice = require(path.resolve(__dirname+'/../db/controller/invoice.controller.js')); 
    app.post('/api/add/header-invoice',invoice.createHeaderInvoice);
    app.post('/api/add/invoice',invoice.createInvoice);
    app.get('/api/invoice-detail/get-last',invoice.getLastInvoiceDetail);
    app.get('/api/invoice-detail/get-last-id-invoice-detail',invoice.getLastInvoiceDetailId);
    app.get('/api/header-invoice/get-last-header-id',invoice.getLastHeaderId);
    app.get('/api/count-max-order-code',invoice.countDistincOrderCode);
    app.get('/api/get-invoices/:id_client',invoice.getInvoicesByClientId)
    app.get('/api/invoice/show/products/:order_code/:username/:id',invoice.findProductsByOrderCode)
}