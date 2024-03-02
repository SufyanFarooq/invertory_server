import { createBill, readBills, readBill, updateBill, deleteBill } from "../controllers/bill.controller.js";
import express from "express";

const router = express.Router();

router.route("/bill").post(createBill);
router.route("/bill").get(readBills);
router.route("/bill/:id").get(readBill);
router.route("/bill/:id").put(updateBill);
router.route("/bill/:id").delete(deleteBill);


export default router;
