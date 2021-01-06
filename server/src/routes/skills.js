const express = require("express");
const skillController = require("../controllers/skills");
const router = express.Router();
const authorize = require('../_helpers/authorize')

router.get("/all", authorize.authenticateJWT, authorize.validateToken, authorize.verifyUser, skillController.fetchAllSkills);
router.post("/addSkill", authorize.authenticateJWT, authorize.validateToken, authorize.verifyManager, skillController.addSkill);
router.post("/addSkills", authorize.authenticateJWT, authorize.validateToken, authorize.verifyManager, skillController.addSkills);
router.post("/updateSkill/:id", authorize.authenticateJWT, authorize.validateToken, authorize.verifyManager, skillController.updateBySkillId);
router.delete("/deleteSkill/:id",  authorize.authenticateJWT, authorize.validateToken, authorize.verifyManager,skillController.deleteSkill);
module.exports = router;
