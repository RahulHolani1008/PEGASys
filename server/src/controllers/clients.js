const Client = require("../models/clients");
const Project = require("../models/projects");

exports.addClient = async (req, res, next) => {
  const newClient = new Client(req.body);
  await newClient
    .save()
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllClients = async (req, res, next) => {
  await Client.find({ deleted: false })
    .sort({ since: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllDeletedClients = async (req, res, next) => {
  await Client.find({ deleted: true })
    .sort({ since: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.fetchClientById = async (req, res, next) => {
  await Client.find({ _id: req.params.id })
    .then(async (client) => {
      res.send(client);
    })
    .catch((err) => res.status(400).send(err));
};

exports.deleteClientById = async (req, res, next) => {
  await Client.findOneAndUpdate({ _id: req.body.id }, { $set: {deleted: true} })
    .then((item) => res.send({ _id: item._id, deleted: true }))
    .catch((err) => res.status(400).send(err));
};

exports.updateClient = async (req, res, next) => {
  await Client.findByIdAndUpdate( {_id : req.params.id }, req.body ,{new:true})
    .then((item) => {res.send(req.body)
    console.log("updated")})
    .catch((err) => res.status(400).send(err));
};





