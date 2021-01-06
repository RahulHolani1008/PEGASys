const Leave = require("../models/leaves");
// const Holiday = require("../models/holidays");
// const moment = require("moment");
// const User = require("../models/users");

// exports.addLeave = async (req, res, next) => {
//     let leave = req.body;
//     leave.to =  new Date(new Date(leave.to).setHours(00, 00, 00))
//     leave.from =  new Date(new Date(leave.from).setHours(00, 00, 00))
//     let leaveBalance = 0;

//     await User.findOne({
//         _id: leave.user
//     })
//         .then((item) => {leaveBalance = item.leaveBalance})
//         .catch((err) => res.status(400).send(err));

//     await Holiday.find(
//         {$or:
//             [
//                 {
//                     from: {
//                         $gte: leave.from,
//                         $lte: leave.to
//                     }
//                 },
//                 {
//                     to: {
//                         $gte: leave.from,
//                         $lte: leave.to
//                     }
//                 }
//             ]
//         , type: "Festival"
//         }
//     )
//         .sort({ from: -1 })
//         .then((items) => {
//             if(leave.from.diff(new Date(), 'days') >= 28) {
//                 if(leaveBalance > leave.from.diff(leave.to, 'days')) {
//                     leave.approved = true;
//                 } else {
//                     leave.approved = false;
//                 }
//             } 
//         })
//         .catch((err) => {
//             if(leave.from.diff(new Date(), 'days') >= 14) {
//                 if(leaveBalance > leave.from.diff(leave.to, 'days')) {
//                     leave.approved = true;
//                 } else {
//                     leave.approved = false;
//                 }
//             } 
//         });
//     const newLeave = new Leave(leave);
//     await newLeave
//         .save()
//         .then((item) => res.send(item))
//         .catch((err) => res.status(400).send(err));
// };

// exports.fetchAllLeaves = async (req, res, next) => {
//   await Leave.find()
//     .sort({ from: -1 })
//     .then((items) => res.send(items))
//     .catch((err) => res.status(400).send(err));
// };

exports.fetchAllLeavesByUser = async (req, res, next) => {
    await Leave.find({ user: req.body.id })
        .sort({ from: 1 })
        .then((items) => res.send(items))
        .catch((err) => res.status(400).send(err));
};

// exports.fetchAllUpcomingLeaves = async (req, res, next) => {
//     const date = new Date()
//     await Leave.find({
//         $gte: new Date(date.setHours(00, 00, 00))
//     })
//         .sort({ from: -1 })
//         .then((items) => res.send(items))
//         .catch((err) => res.status(400).send(err));
// };

// exports.calculateLeavesLeftForAllUsers = async (req, res, next) => {
//   await Leave.findOneAndUpdate({ _id: req.params.id }, req.body)
//     .then((item) => res.send(item))
//     .catch((err) => res.status(400).send(err));
// };

// exports.calculateLeavesLeftForAllUsers = async (req, res, next) => {
//     await Leave.findOneAndUpdate({ _id: req.params.id }, req.body)
//       .then((item) => res.send(item))
//       .catch((err) => res.status(400).send(err));
// };
