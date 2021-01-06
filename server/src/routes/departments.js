const express = require("express");
const departmentController = require("../controllers/departments");
const router = express.Router();

router.get("/all", departmentController.fetchAllDepartments);
router.post("/addDepartment", departmentController.addDepartment);
router.post("/updateDepartment/:id", departmentController.updateByDepartmentId);

module.exports = router;
