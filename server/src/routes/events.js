const express = require("express");
const eventsController = require("../controllers/events");
const router = express.Router();
router.post("/addEvent", eventsController.addEvent);
router.get("/allEvents", eventsController.getAllEvents);
router.get("/allUpcomingEvents", eventsController.getAllUpcomingEvents);
module.exports = router;