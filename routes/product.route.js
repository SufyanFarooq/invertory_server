import { addProduct, getProducts, getProductbyId, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import express from "express";

const router = express.Router();

router.route("/product").post(addProduct);
router.route("/product").get(getProducts);
router.route("/product/:id").get(getProductbyId);
router.route("/product/:id").put(updateProduct);
router.route("/product/:id").delete(deleteProduct);


export default router;
