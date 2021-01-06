const Skill = require("../models/skills");

exports.addSkill = async (req, res, next) => {
  const newSkill = new Skill(req.body);
  await newSkill
    .save()
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.addSkills = async (req, res, next) => {
  let skills = req.body.map((skill) => new Skill(skill));
  await Skill.insertMany(skills)
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllSkills = async (req, res, next) => {
  await Skill.find({})
    .sort()
    .populate("department")
    .then((items) =>{res.send(items)})
    .catch((err) => res.status(400).send(err));
};

exports.updateBySkillId = async (req, res, next) => {
  await Skill.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};
exports.deleteSkill = async (req, res, next) => {
  await Skill.findByIdAndDelete({_id : req.params.id })
    .then((item) => res.send({ _id: item._id }))
    .catch((err) => res.status(400).send(err));
};


