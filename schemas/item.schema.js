import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: String
});

export const Item = mongoose.model('Item', itemSchema);
