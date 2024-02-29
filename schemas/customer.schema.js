import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    CNIC: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
});

export const Customer = mongoose.model('Customer', customerSchema);
