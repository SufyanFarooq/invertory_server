const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const dbConnection = require('./connection/db.js');
const products = require("./routes/product.route.js");
const items = require("./routes/item.route.js");
const department = require("./routes/department.route.js");
const customer = require("./routes/customers.route.js");
const bill = require("./routes/bill.route.js");

require('dotenv').config()



const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// define routes
app.use("/api", products);
app.use("/api", items);
app.use("/api", department);
app.use("/api", customer);
app.use("/api", bill);




app.get("/home", (req, res) => {
    res.status(200).send("ticket server running successfully")
});

const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
    dbConnection()
    console.log(`Server running on port http://localhost:${PORT}`);
});
