import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import dbConnection from './connection/db.js';
import products from "./routes/product.route.js";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// define routes
app.use("/api/product", products)
app.get("/", (req, res) => {
    res.status(200).send("ticket server running successfully")
});

const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
    dbConnection()
    console.log(`Server running on port http://localhost:${PORT}`);
});