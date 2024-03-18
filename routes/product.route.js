
const { addProduct, getProducts, getProductbyId, updateProduct, deleteProduct } = require ("../controllers/product.controller");
const express = require("express");

const router = express.Router();

// router.get("/", getProducts);

router.route("/product").post(addProduct);
router.route("/product").get(getProducts);
router.route("/product/:id").get(getProductbyId);
router.route("/product/:id").put(updateProduct);
router.route("/product/:id").delete(deleteProduct);


module.exports = router;
