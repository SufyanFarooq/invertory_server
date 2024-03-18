const { addItem, getItems, getItembyId, updateItem, deleteItem } = require ("../controllers/item.controller");
const express = require("express");

const router = express.Router();

router.route("/item").post(addItem);
router.route("/item").get(getItems);
router.route("/item/:id").get(getItembyId);
router.route("/item/:id").put(updateItem);
router.route("/item/:id").delete(deleteItem);


module.exports = router;
