import { addProduct, getProducts } from "../controllers/product.controller.js";
import express from "express";

const router = express.Router();

router.route("/product").post(addProduct);
router.route("/product").post(getProducts);
// router.route("/product").post(addProduct);
// router.route("/product").post(addProduct);
// router.route("/product").post(addProduct);


export default router;
