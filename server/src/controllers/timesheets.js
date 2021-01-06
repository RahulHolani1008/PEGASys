const Project = require("../models/projects");
const TimeSheet = require("../models/timesheets");

exports.addTimeSheet = async (req, res, next) => {
  const newTimeSheet = new TimeSheet(req.body);
  await newTimeSheet
    .save()
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllTimeSheetByUserId = async (req, res, next) => {
  await TimeSheet.find({ user: req.params.id, deleted: false })
    .populate("project", { name: 1 })
    .populate("mentor", { firstName: 1, lastName: 1 })
    .populate("user", { firstName: 1, lastName: 1 })
    .sort({ reportDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllTimeSheets = async (req, res, next) => {
  let today = new Date();
  let lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1)
  await TimeSheet.find({deleted: false, reportDate: {
      $gte: new Date(lastMonth.setHours(00, 00, 00)),
      $lte: new Date(today.setHours(23, 59, 59)),
    } 
  })
    .populate("project", { name: 1 })
    .populate("mentor", { firstName: 1, lastName: 1 })
    .populate("user", { firstName: 1, lastName: 1 })
    .sort({ reportDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllTimeSheetsByUserIdByDay = async (req, res, next) => {
  await TimeSheet.find({ user: req.params.id, reportDate: {
      $gte: new Date(new Date(req.body.date).setHours(00, 00, 00)),
      $lte: new Date(new Date(req.body.date).setHours(23, 59, 59)),
    } 
  })
    .populate("project", { name: 1 })
    .populate("user", { firstName: 1, lastName: 1 })
    .then((item) => {console.log(item); return res.send(item)})
    .catch((err) => res.status(400).send(err));
};

containsObject = (obj, list) => {
  let i;
  for (i = 0; i < list.length; i++) {
    if (list[i].name === obj) {
      return true;
    }
  }

  return false;
};


exports.approveTimeSheet = async (req, res, next) => {
  await TimeSheet.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        isApproved: req.body.isApproved,
        isRejected: !req.body.isApproved,
      },
    }
  )
    .then((item) => {
      if (req.body.isApproved) {
        Project.updateMany(
          { _id: req.body.project },
          {
            $addToSet: { users: req.params.id },
          }
        );
      }
      return res.send({
        isApproved: req.body.isApproved,
        isRejected: !req.body.isApproved,
      });
    })
    .catch((err) => res.status(400).send(err));
};

exports.editTimeSheets = async (req, res, next) => {
  let timesheets = req.body;
  await TimeSheet.deleteMany({ reportDate: {
      $gte: new Date(new Date(timesheets[0].reportDate).setHours(00, 00, 00)),
      $lte: new Date(new Date(timesheets[0].reportDate).setHours(23, 59, 59)),
    }, user: timesheets[0].user})
    .then(async (item) => {
      timeSheets = timesheets.map((time) => {time.reportDate = new Date(new Date(time.reportDate).setHours(18, 00, 00)); console.log(time); return new TimeSheet(time)});
      await TimeSheet.insertMany(timeSheets)
        .then((item) => res.send(item))
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => res.status(400).send(err));
};

exports.deleteTimeSheets = async (req,res,next) => {
  let timesheets = req.body;
  await TimeSheet.deleteMany({ reportDate: {
      $gte: new Date(new Date(timesheets[0].reportDate).setHours(00, 00, 00)),
      $lte: new Date(new Date(timesheets[0].reportDate).setHours(23, 59, 59)),
    }, user: timesheets[0].user})
    .then((item) =>
      res.send("Deleted successfully")
    )
}

exports.updateTimeSheet = async (req, res, next) => {
  await TimeSheet.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.approveTimeSheetForDay = async (req, res, next) => {
  const date = new Date(req.body.date)
  await TimeSheet.updateMany(
    {
      user: req.params.id,
      reportDate: {
        $gte: date.setHours(00, 00, 00),
        $lte: date.setHours(23, 59, 59),
      },
    },
    {
      $set: {
        isApproved: req.body.isApproved,
        isRejected: !req.body.isApproved,
      },
    }
  )
    .then((items) => {
      return res.send(items);
    })
    .catch((err) => res.status(400).send(err));
};

exports.addMultipleTimeSheets = async (req, res, next) => {
  let timeSheets = req.body.map((time) => {time.reportDate = new Date(new Date(time.reportDate).setHours(18, 00, 00)); return new TimeSheet(time)});
  await TimeSheet.insertMany(timeSheets)
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.getTimeSheetsByProject = async (req, res, next) => {
  await TimeSheet.find({ project: req.params.id })
  .populate("mentor", { firstName: 1, lastName: 1 })
  .populate("user", { firstName: 1, lastName: 1 })
    .sort({ reportDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.getTimeSheetsByProjectByDate = async (req, res, next) => {
  await TimeSheet.find({
    project: req.params.id,
    reportDate: {
      $gte: new Date(new Date(req.body.date).setHours(00, 00, 00)),
      $lte: new Date(new Date(req.body.date).setHours(23, 59, 59)),
    },
  })    .populate("mentor", { firstName: 1, lastName: 1 })
  .populate("user", { firstName: 1, lastName: 1 })
    .sort({ reportDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.getTimeSheetsByProjectByDateRange = async (req, res, next) => {
  await TimeSheet.find({
    project: req.params.id,
    reportDate: {
      $gte: new Date(new Date(req.body.startDate).setHours(00, 00, 00)),
      $lte: new Date(new Date(req.body.endDate).setHours(23, 59, 59)),
    },
  })    .populate("mentor", { firstName: 1, lastName: 1 })
  .populate("user", { firstName: 1, lastName: 1 })
    .sort({ reportDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.getTimeSheetsByUserByDateRange = async (req, res, next) => {
  await TimeSheet.find({
    user: req.params.id,
    reportDate: {
      $gte: new Date(new Date(req.body.startDate).setHours(00, 00, 00)),
      $lte: new Date(new Date(req.body.endDate).setHours(23, 59, 59)),
    },
  })    
  .populate("mentor", { firstName: 1, lastName: 1 })
  .populate("user", { firstName: 1, lastName: 1 })
    .sort({ reportDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.getTimeSheetsByMentees = async (req, res, next) => {
  await TimeSheet.find({
    mentor: req.params.id
  })    .populate("mentor", { firstName: 1, lastName: 1 })
  .populate("user", { firstName: 1, lastName: 1 })
    .sort({ reportDate: -1 })
    .populate("project", { name: 1 })
    .then( async (items) => await res.send(items))
    .catch(async (err) => await res.status(400).send(err));
};

exports.getTimeSheetsByManagees = async (req, res, next) => {
  await TimeSheet.find()    
  .populate("mentor", { firstName: 1, lastName: 1 })
  .populate("user", { firstName: 1, lastName: 1, departments: 1 })
    .sort({ reportDate: -1 })
    .populate("project", { name: 1 })
    .then( async (items) => {
      res.send(items.filter(item => {
        let flag = false;
        item.user.departments.forEach(dept => {
          req.body.departments.forEach(dep => {
            if(dep == dept && req.body.userId != item.user._id && req.body.mentor != item.user._id) {
              flag = true;
            }
          })
        })
        if(flag) return true;
        else return false;
      })
      );
    }
  )
    .catch(async (err) => await res.status(400).send(err));
}

exports.getTimeSheetsByProjects = async (req, res, next) => {
  await Project.find({$or: [{POC: req.body.userId}, {lead: req.body.userId}]})
    .then( async (items) => {
      const projects = [];
      items.forEach(item => {
        if(!projects.includes(item._id)) projects.push(item._id);
      })
        await TimeSheet.find({project: {$in: projects}})
          .populate("mentor", { firstName: 1, lastName: 1 })
          .populate("user", { firstName: 1, lastName: 1, departments: 1 })
          .sort({ reportDate: -1 })
          .populate("project", { name: 1 })
          .then( async (timesheets) => await res.send(timesheets))
          .catch(async (err) => await res.status(400).send(err));
    })
    .catch(async (err) => await res.status(400).send(err));
};

addToArrIfNotExist = (arr, project) => {
  for (index in arr) {
    if (arr[index].name == project.name) {
      arr[index].time += project.time;
      return arr;
    }
  }
  arr.push({ name: project.name, time: project.time });
  console.log(arr);
  return arr;
};

exports.getTimeSpentByUser = async (req, res, next) => {
  let timesheets = [];
  await TimeSheet.find({
    user: req.params.id,
    reportDate: {
      $gte: new Date(new Date(req.body.startDate).setHours(00, 00, 00)),
      $lte: new Date(new Date(req.body.endDate).setHours(23, 59, 59)),
    },
  })    
    .populate("project", { name: 1 })
    .then((items) => {
      items.forEach((item) => {
        if (!item.isRejected) {
          let time = 0;
          item.sheets.forEach(sheet => {
            time += sheet.timeSpent;
          })
          timesheets = addToArrIfNotExist(timesheets, {
            name: item.project.name,
            time: time,
          });
        }
      });
      res.send(timesheets);
    })
    .catch((err) => res.status(400).send(err));
};

exports.getTimeSpentByOrg = async (req, res, next) => {
  let timesheets = [];
  await TimeSheet.find({
    reportDate: {
      $gte: new Date(new Date(req.body.startDate).setHours(00, 00, 00)),
      $lte: new Date(new Date(req.body.endDate).setHours(23, 59, 59)),
    },
  })    .populate("mentor", { firstName: 1, lastName: 1 })
  .populate("user", { firstName: 1, lastName: 1 })
    .populate("project", { name: 1 })
    .sort({ reportDate: -1 })
    .then((items) => {
      items.forEach((item) => {
        if (!item.isRejected) {
          let time = 0;
          item.sheets.forEach(sheet => {
            time += sheet.timeSpent;
          })
          timesheets = addToArrIfNotExist(timesheets, {
            name: item.project.name,
            time: time,
          });
        }
      });
      res.send(timesheets);
    })
    .catch((err) => res.status(400).send(err));
};
