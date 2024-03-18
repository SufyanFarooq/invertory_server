const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

exports.Department = mongoose.model('Department', departmentSchema);
