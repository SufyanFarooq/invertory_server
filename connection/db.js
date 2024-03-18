// create db connection 
const mongoose = require('mongoose');
const { db_url } = require("../config");

const dbConnection = () => {
    try {
        mongoose.connect(db_url);
        console.log("database connected successfully");
    } catch (e) {
        console.error("error while connect db");
    }
}

module.exports = dbConnection;