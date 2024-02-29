import { addItem, getItems, getItembyId, updateItem, deleteItem } from "../controllers/item.controller.js";
import express from "express";

const router = express.Router();

router.route("/item").post(addItem);
router.route("/item").get(getItems);
router.route("/item/:id").get(getItembyId);
router.route("/item/:id").put(updateItem);
router.route("/item/:id").delete(deleteItem);


export default router;
