const express = require("express");
const clientsController = require("../controllers/clients");
const router = express.Router();

router.get("/all", clientsController.fetchAllClients);
router.get("/:id", clientsController.fetchClientById);
router.get("/all/deleted", clientsController.fetchAllDeletedClients);
router.post("/addClient", clientsController.addClient);
router.post("/deleteClient", clientsController.deleteClientById);
router.post("/updateClient/:id", clientsController.updateClient);

module.exports = router;