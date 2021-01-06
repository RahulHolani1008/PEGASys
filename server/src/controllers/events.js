const Event = require("../models/events");
exports.addEvent = async (req, res, next) => {
  const newEvent = new Event(req.body);
  await newEvent
    .save()
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};
exports.getAllEvents = async (req, res, next) => {
     await Event.find()
    .populate("postedBy", { firstName: 1, lastName: 1 })
    .then((item) => {console.log(item); return res.send(item)})
    .catch((err) => res.status(400).send(err));
};
exports.getAllUpcomingEvents = async (req, res, next) => {
     await Event.find( {date : { $gte :  new Date(new Date().setHours(0,0,0,0))}  })
     .populate("postedBy", { firstName: 1, lastName: 1 })
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};
