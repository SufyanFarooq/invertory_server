const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    billNumber: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    products: [{
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
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalSaleTax: {
        type: Number,
        required: true
    },
    totalIncomeTax: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true });

exports.Bill = mongoose.model('Bill', billSchema);
