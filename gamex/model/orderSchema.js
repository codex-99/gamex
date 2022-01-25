const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {type: String, required: true},
    userId: {type: String, required: true},
    productId: {type: String, required: true}
})

const Orders = new mongoose.model('Order', orderSchema);
module.exports = Orders;