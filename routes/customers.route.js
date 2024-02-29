import { addCustomer, getCustomers, getCustomerbyId, updateCustomer, deleteCustomer } from "../controllers/customers.controller.js";
import express from "express";

const router = express.Router();

router.route("/customer").post(addCustomer);
router.route("/customer").get(getCustomers);
router.route("/customer/:id").get(getCustomerbyId);
router.route("/customer/:id").put(updateCustomer);
router.route("/customer/:id").delete(deleteCustomer);


export default router;
