// create db connection 
const mongoose = require('mongoose');
const { db_url } = require("../config");

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("database connected successfully");
    } catch (e) {
        console.error("error while connect db");
    }
}

module.exports = dbConnection;