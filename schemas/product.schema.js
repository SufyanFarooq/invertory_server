const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    saleTaxPercentage: {
        type: Number,
        required: true
    },
    incomeTaxPercentage: {
        type: Number,
        required: true
    },
});

exports.Product = mongoose.model('Product', productSchema);
