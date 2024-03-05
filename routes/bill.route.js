import { createBill, readBills, readBill, updateBill, deleteBill, getBillAsExcel, getInvoiceAsExcel } from "../controllers/bill.controller.js";
import express from "express";

const router = express.Router();

router.route("/bill").post(createBill);
router.route("/bill").get(readBills);
router.route("/bill/:id").get(readBill);
router.route("/bill/:id").put(updateBill);
router.route("/bill/:id").delete(deleteBill);
router.route("/bill/getBillAsExcel/:id").get(getBillAsExcel);
router.route("/bill/getInvoiceAsExcel/:id").get(getInvoiceAsExcel)


export default router;
