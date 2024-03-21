const { createBill, readBills, readBill, updateBill, deleteBill, getBillAsExcel, getInvoiceAsExcel, getLatestBillNumber, getInvoicesbyDate } = require("../controllers/bill.controller");
const express = require("express");

const router = express.Router();

router.post("/bill", createBill);
router.get("/bill", readBills);
router.get("/bill/:id", readBill);
router.put("/bill/:id", updateBill);
router.delete("/bill/:id", deleteBill);
// Route to get the latest bill number
router.get('/latestBillNumber', getLatestBillNumber);
router.get("/bill/getBillAsExcel/:id", getBillAsExcel);
router.get("/bill/getInvoiceAsExcel", getInvoicesbyDate);


module.exports = router;
