const { addDepartment, getDepartments, getDepartmentbyId, updateDepartment, deleteDepartment } = require ("../controllers/department.controller");
const express = require("express");

const router = express.Router();

router.route("/department").post(addDepartment);
router.route("/department").get(getDepartments);
router.route("/department/:id").get(getDepartmentbyId);
router.route("/department/:id").put(updateDepartment);
router.route("/department/:id").delete(deleteDepartment);


module.exports = router;
