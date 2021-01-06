const SkillDepartment = require("../models/skillDepartments");

exports.addSkillDepartment = async (req, res, next) => {
  const newSkillDepartment = new SkillDepartment(req.body);
  await newSkillDepartment
    .save()
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllSkillDepartments = async (req, res, next) => {
  await SkillDepartment.find()
    .then((items) => {res.send(items)
  })
    .catch((err) => res.status(400).send(err));
};

exports.fetchSkillDepartmentById = async (req, res, next) => {
  await SkillDepartment.find({ _id: req.params.id })
    .then(async (skillDepartment) => {
      res.send(skillDepartment);
    })
    .catch((err) => res.status(400).send(err));
};

exports.deleteSkillDepartment = async (req, res, next) => {
  await SkillDepartment.findByIdAndDelete({_id : req.params.id })
    .then((item) => res.send({ _id: item._id }))
    .catch((err) => res.status(400).send(err));
};

exports.updateSkillDepartment = async (req, res, next) => {
  await SkillDepartment.findByIdAndUpdate( {_id : req.params.id }, req.body ,{new:true})
    .then((item) => {res.send(req.body)
    console.log("updated")})
    .catch((err) => res.status(400).send(err));
};

