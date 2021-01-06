const express = require("express");
const projectsController = require("../controllers/projects");
const router = express.Router();
const authorize = require('../_helpers/authorize')

router.get("/all", authorize.authenticateJWT, authorize.validateToken, authorize.verifyUser, projectsController.fetchAllProjects);
router.get("/allProjectsWithClients", authorize.authenticateJWT, authorize.validateToken, authorize.verifyUser, projectsController.fetchAllProjectsWithClients);
router.get("/:id", authorize.authenticateJWT, authorize.validateToken, authorize.verifyUser, projectsController.fetchProjectById);
router.get("/all/:id", authorize.authenticateJWT, authorize.validateToken, authorize.verifyUser, projectsController.fetchProjectsByUserId);
router.get("/all/deleted", authorize.authenticateJWT, authorize.validateToken, authorize.verifyAdmin, projectsController.fetchAllDeletedProjects);
router.post("/addProject", authorize.authenticateJWT, authorize.validateToken, authorize.verifyManager, projectsController.addProject);
router.delete("/deleteProject/:id", authorize.authenticateJWT, authorize.validateToken, authorize.verifyManager, projectsController.deleteProject);
router.put("/updateProject/:id", authorize.authenticateJWT, authorize.validateToken, authorize.verifyManager, projectsController.updateProject);
router.get("/allProjectsByClientId/:id", projectsController.fetchAllProjectByClientId);
router.get("/allClients", authorize.authenticateJWT, authorize.validateToken, authorize.verifyUser, projectsController.getClients)

module.exports = router;