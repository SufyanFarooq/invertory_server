import { addDepartment, getDepartments, getDepartmentbyId, updateDepartment, deleteDepartment } from "../controllers/department.controller.mjs";
import express from "express";

const router = express.Router();

router.route("/department").post(addDepartment);
router.route("/department").get(getDepartments);
router.route("/department/:id").get(getDepartmentbyId);
router.route("/department/:id").put(updateDepartment);
router.route("/department/:id").delete(deleteDepartment);


export default router;
