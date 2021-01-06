const Project = require("../models/projects");
const Client = require("../models/clients");

exports.addProject = async (req, res, next) => {
  console.log(req.body);
  const newProject = new Project(req.body);
  await newProject
    .save()
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllProjects = async (req, res, next) => {
  await Project.find({ deleted: false })
  .populate("POC", { firstName: 1, lastName: 1 })
  .populate("lead", { firstName: 1, lastName: 1 })
  .populate("client", {name: 1})
    .sort({ createdDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.getClients = async (req, res, next) => {
  await Client.find({ deleted: false })
  .then((items) => res.send(items))
  .catch((err) => {console.log(err) ; return res.status(400).send(err)});
}

exports.fetchAllDeletedProjects = async (req, res, next) => {
  await Project.find({ deleted: true })
    .sort({ createdDate: -1 })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
};

exports.fetchProjectById = async (req, res, next) => {
  await Project.find({ _id: req.params.id })
    .populate("users", { firstName: 1, lastName: 1 })
    .populate("POC", { firstName: 1, lastName: 1 })
    .populate("lead", { firstName: 1, lastName: 1 })
    .then(async (project) => {
      res.send(project);
    })
    .catch((err) => res.status(400).send(err));
};


exports.fetchProjectsByUserId = async (req, res, next) => {
  await Project.find({ $or:[ {'POC':req.params.id}, {'lead':req.params.id}] })
    .then((projects) => {
      console.log(projects)
      return res.send(projects);
    })
    .catch((err) => res.status(400).send(err));
};

exports.deleteProject = async (req, res, next) => {
  await Project.findOneAndUpdate({ _id: req.body.id }, { deleted: true })
    .then((item) => res.send({ _id: item._id, deleted: true }))
    .catch((err) => res.status(400).send(err));
};

exports.updateProject = async (req, res, next) => {
  await Project.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((item) => res.send(req.body))
    .catch((err) => res.status(400).send(err));
};

exports.addUserToProject = async (req, res, next) => {
  await Project.updateMany(
    { _id: req.body.projectId },
    {
      $addToSet: { users: req.body.userIds },
    }
  )
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.deleteUserFromProject = async (req, res, next) => {
  await Project.updateMany(
    { _id: req.body.projectId },
    {
      $pullAll: { users: req.body.userIds },
    }
  )
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.fetchAllProjectByClientId = async (req, res, next) => {
  await Project.find( {'client' : req.params.id })
    .then((item) => {
      console.log("item")
     res.send(item);
    })
    .catch((err) =>{ res.status(400).send(err)
     console.log("bad request")
    });
};
exports.fetchAllProjectsWithClients = async (req, res, next) => {
  const clientData=[]
  var idx,a=[];
    await Project.find({deleted:false})
    .populate("client",{name: 1} )
    .then((item) => {  
      console.log(item)   
     item.forEach((data,i)=>{
      
       if(clientData.length>0){
       a=clientData.filter((cData,index)=>{
         idx=index
        console.log(data.client.equals(cData.clientId))
        return data.client.equals(cData.clientId);
      });
    }
      if(a.length>0){
        console.log(idx)
        clientData[idx].projects.push({projectId:data._id,projectName:data.name})
      }
      else{
       // console.log(data.client)
        clientData.push({
          clientId:data.client,
          projects:[{projectId:data._id,projectName:data.name}]
        })
      }
     })
     res.send(clientData);
    })
    .catch((err) =>{ res.status(400).send(err)
     console.log("bad request")
    });
};


