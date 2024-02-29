// create db connection 
import mongoose from "mongoose"
import { db_url } from "../config.js"

const dbConnection = () => {
    try {
        mongoose.connect(db_url);
        console.log("database connected successfully");
    } catch (e) {
        console.error("error while connect db");
    }
}

export default dbConnection;