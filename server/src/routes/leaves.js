const express = require("express");
const leavesController = require("../controllers/leaves");
const router = express.Router();
router.get("/all", leavesController.fetchAllLeavesByUser);

module.exports = router;