const { createBill, readBills, readBill, updateBill, deleteBill, getBillAsExcel, getInvoiceAsExcel } = require ("../controllers/bill.controller");
const express = require("express");

const router = express.Router();

router.route("/bill").post(createBill);
router.route("/bill").get(readBills);
router.route("/bill/:id").get(readBill);
router.route("/bill/:id").put(updateBill);
router.route("/bill/:id").delete(deleteBill);
router.route("/bill/getBillAsExcel/:id").get(getBillAsExcel);
router.route("/bill/getInvoiceAsExcel/:id").get(getInvoiceAsExcel)


module.exports = router;
