import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import dbConnection from './connection/db.js';
import products from "./routes/product.route.js";
import items from "./routes/item.route.js";
import department from "./routes/department.route.js";
import customer from "./routes/customers.route.js";
import bill from "./routes/bill.route.js";





const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// define routes
app.use("/", products);
app.use("/api", items);
app.use("/api", department);
app.use("/api", customer);
app.use("/api", bill);




app.get("/", (req, res) => {
    res.status(200).send("ticket server running successfully")
});

const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
    dbConnection()
    console.log(`Server running on port http://localhost:${PORT}`);
});