const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {type: String, required: true, unique: true},
    productName: {type: String, required: true},
    productPrice: {type: Number, required: true}
})

const Products = new mongoose.model('Product', productSchema);

module.exports = Products;