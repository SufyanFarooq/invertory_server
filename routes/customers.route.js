const { addCustomer, getCustomers, getCustomerbyId, updateCustomer, deleteCustomer } = require ("../controllers/customers.controller");
const express = require("express");

const router = express.Router();

router.route("/customer").post(addCustomer);
router.route("/customer").get(getCustomers);
router.route("/customer/:id").get(getCustomerbyId);
router.route("/customer/:id").put(updateCustomer);
router.route("/customer/:id").delete(deleteCustomer);


module.exports = router;
