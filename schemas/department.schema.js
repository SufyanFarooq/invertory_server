import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String
    }
});

export const Department = mongoose.model('Department', departmentSchema);
