const Department = require("../models/departments");

exports.addDepartment = async (req, res, next) => {
  const newDepartment = new Department(req.body);
  await newDepartment
    .save()
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllDepartments = async (req, res, next) => {
  await Department.find()
    .sort({ createdDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.updateByDepartmentId = async (req, res, next) => {
  await Department.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};
