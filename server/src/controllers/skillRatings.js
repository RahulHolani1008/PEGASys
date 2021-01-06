const SkillRating = require("../models/skillRatings");

exports.addRatings = async (req, res, next) => {
  console.log(req.body);
  let skillList = []
  let skills = req.body.map((skill) => {skillList.push(skill.skill); return new SkillRating(skill)});
  console.log(skillList)
  await SkillRating.deleteMany({to:skills[0].to, from:skills[0].from, skill: {$in: skillList}})
    .then(async (item) => {
      console.log(item);
      await SkillRating.insertMany(skills)
        .then((item) => res.send(item))
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => res.status(400).send(err));
};

exports.deleteRatings = async (req, res, next) => {
  
  await SkillRating.deleteMany({to: req.body.to, skill: req.body.skill})
    .then((item) => {
      console.log("hello")
      res.send(item)})
    .catch((err) => res.status(400).send(err));
};


exports.compareSelfWithActual = async (req, res, next) => {
  await SkillRating.find({
      to: req.params.id
    })
    .populate("skill", {
      name: 1,
      department: 1
    })
    .then((items) => {
      let selfRating = [];
      let peerRating = [];
      let peerRatingCount = [];
      let mentorRating = [];
      let managerRating = [];
      let skillList = [];
      let result = [];
      items.forEach((rating) => {
        if (!skillList.includes(rating.skill.name))
          skillList.push(rating.skill.name);
        switch (rating.role) {
          case "self":
            selfRating = addToArrayIfNotExist(selfRating, {
              name: rating.skill.name,
              rating: rating.rating,
            });
            break;
          case "peer":
            peerRating = addToArrayIfNotExist(peerRating, {
              name: rating.skill.name,
              rating: rating.rating,
            });
            peerRatingCount = addToArrayIfNotExist(peerRatingCount, {
              name: rating.skill.name,
              rating: 1,
            });
            break;
          case "mentor":
            mentorRating = addToArrayIfNotExist(mentorRating, {
              name: rating.skill.name,
              rating: rating.rating,
            });
            break;
          case "manager":
            managerRating = addToArrayIfNotExist(managerRating, {
              name: rating.skill.name,
              rating: rating.rating,
            });
            break;
        }
      });
      console.log(peerRatingCount);
      skillList.forEach((skill, index) => {
        const sR = selfRating.find((rating) => rating.name == skill) ?
          selfRating.find((rating) => rating.name == skill).rating :
          0;
        const pR = peerRating.find((rating) => rating.name == skill) ?
          peerRating.find((rating) => rating.name == skill).rating :
          0;
        const pRC = peerRatingCount.find((rating) => rating.name == skill) ?
          peerRatingCount.find((rating) => rating.name == skill).rating :
          1;
        const meR = mentorRating.find((rating) => rating.name == skill) ?
          mentorRating.find((rating) => rating.name == skill).rating :
          0;
        const maR = managerRating.find((rating) => rating.name == skill) ?
          managerRating.find((rating) => rating.name == skill).rating :
          0;
        result[index] = {
          skill: skill,
          rating: (((sR * 1) + ((pR / pRC) * 1.5) + (meR * 2.5) + (maR * 1.75)) /
              ((pR ? 1.5 : 0) + (1) + (meR ? 2.5 : 0) + (maR ? 1.75 : 0))) -
            sR,
        };
      });
      return res.send(result);
    })
    .catch((err) => res.status(400).send(err));
};

exports.fetchRatingsGivenByUserToUser = async (req, res, next) => {
  await SkillRating.find({
      to: req.params.to,
      from: req.params.from
    })
    .populate("skill", {
      name: 1
    })
    .then((items) => res.send(items))
    .catch((err) => res.status(400).send(err));
}

exports.fetchRatingsGivenByUserBySkill = async (req, res, next) => {
  await SkillRating.find({
      from: req.params.from,
      skill: req.params.skillId,
    })
    .populate("skill")
    .populate({
      path: 'to',
      populate: {
        path: 'departments'
      }
    })
    .then((items) => {res.send(items.filter(rating => rating.to.deleted == false))})
    .catch((err) => res.status(400).send(err));
}

exports.fetchAllUsersBySkill = async (req, res, next) => {
  await SkillRating.find({
      skill: req.params.id
    })
    .populate("skill", {
      name: 1,
      department: 1
    })
    .populate({
      path: 'to',
      populate: {
        path: 'departments'
      }
    })
    .then((items) => {
      let selfRating = [];
      let peerRating = [];
      let peerRatingCount = [];
      let mentorRating = [];
      let managerRating = [];
      let managerRatingCount = [];
      let userList = [];
      let result = [];
      let departmentsOfUser = [];
      items.forEach((rating, index) => {
        // console.log(rating);
        departmentsOfUser[index] = rating.to.departments;
        if (userList.filter(user => user.name === rating.to.firstName + " " + rating.to.lastName).length < 1 && rating.to.deleted == false)
          userList.push({
            name: rating.to.firstName + " " + rating.to.lastName,
            skillId: rating.skill._id,
            skill: rating.skill.name,
            userId: rating.to._id
          });
        switch (rating.role) {
          case "self":
            selfRating = addToArrayIfNotExist(selfRating, {
              name: rating.to.firstName + " " + rating.to.lastName,
              rating: rating.rating,
            });
            break;
          case "peer":
            peerRating = addToArrayIfNotExist(peerRating, {
              name: rating.to.firstName + " " + rating.to.lastName,
              rating: rating.rating,
            });
            peerRatingCount = addToArrayIfNotExist(peerRatingCount, {
              name: rating.to.firstName + " " + rating.to.lastName,
              rating: 1,
            });
            break;
          case "mentor":
            mentorRating = addToArrayIfNotExist(mentorRating, {
              name: rating.to.firstName + " " + rating.to.lastName,
              rating: rating.rating,
            });
            break;
          case "manager":
            managerRating = addToArrayIfNotExist(managerRating, {
              name: rating.to.firstName + " " + rating.to.lastName,
              rating: rating.rating,
            });
            managerRatingCount = addToArrayIfNotExist(managerRatingCount, {
              name: rating.to.firstName + " " + rating.to.lastName,
              rating: 1,
            });
            break;
        }
      });
      userList.forEach((to, index) => {
        const sR = selfRating.find((rating) => rating.name == to.name) ?
          selfRating.find((rating) => rating.name == to.name).rating :
          0;
        const pR = peerRating.find((rating) => rating.name == to.name) ?
          peerRating.find((rating) => rating.name == to.name).rating :
          0;
        const pRC = peerRatingCount.find((rating) => rating.name == to.name) ?
          peerRatingCount.find((rating) => rating.name == to.name).rating :
          1;
        const meR = mentorRating.find((rating) => rating.name == to.name) ?
          mentorRating.find((rating) => rating.name == to.name).rating :
          0;
        const maR = managerRating.find((rating) => rating.name == to.name) ?
          managerRating.find((rating) => rating.name == to.name).rating :
          0;
        const mRC = peerRatingCount.find((rating) => rating.name == to.name) ?
          managerRatingCount.find((rating) => rating.name == to.name).rating :
          1;
        result[index] = {
          department: departmentsOfUser[index],
          user: to.name,
          userId: to.userId,
          skillId: to.skillId,
          skill: to.skill,
          rating: ((sR * 1) + ((pR / pRC) * 1.5) + (meR * 2.5) + ((maR / mRC) * 2.5)) /
            ((pRC ? 1.5 : 0) + (1) + (meR ? 2.5 : 0) + (mRC ? 1.75 : 0)),
        };
      });
      return res.send(result);
    })
    .catch((err) => res.status(400).send(err));
};

addToArrayIfNotExist = (arr, project) => {
  for (index in arr) {
    if (arr[index].name == project.name) {
      arr[index].rating += project.rating;
      return arr;
    }
  }
  arr.push({
    name: project.name,
    rating: project.rating
  });
  return arr;
};

exports.fetchAllRatingsByUser = async (req, res, next) => {
  await SkillRating.find({
      to: req.params.id
    })
    .populate("skill", {
      name: 1,
      department: 1
    })
    .populate("to", {
      firstName: 1,
      lastName: 1,
      deleted: 1
    })
    .then((items) => {
      console.log(items)
      let selfRating = [];
      let peerRating = [];
      let peerRatingCount = [];
      let mentorRating = [];
      let managerRating = [];
      let skillList = [];
      let result = [];
      items.forEach((rating) => {
        if (skillList.filter(skill => skill.name === (rating.skill.name)).length < 1 && rating.to.deleted === false)
          skillList.push({name: rating.skill.name, id: rating.skill.id});

          console.log(selfRating)
        switch (rating.role) {
          case "self":
            selfRating = addToArrayIfNotExist(selfRating, {
              name: rating.skill.name,
              rating: rating.rating,
              id: rating.skill._id
            });
            break;
          case "peer":
            peerRating = addToArrayIfNotExist(peerRating, {
              name: rating.skill.name,
              id: rating.skill._id,
              rating: rating.rating,
            });
            peerRatingCount = addToArrayIfNotExist(peerRatingCount, {
              name: rating.skill.name,
              id: rating.skill._id,
              rating: 1,
            });
            break;
          case "mentor":
            mentorRating = addToArrayIfNotExist(mentorRating, {
              name: rating.skill.name,
              id: rating.skill._id,
              rating: rating.rating,
            });
            break;
          case "manager":
            managerRating = addToArrayIfNotExist(managerRating, {
              name: rating.skill.name,
              id: rating.skill._id,
              rating: rating.rating,
            });
            break;
        }
      });
      console.log(peerRatingCount);
      skillList.forEach((skill, index) => {
        const sR = selfRating.find((rating) => rating.name == skill) ?
          selfRating.find((rating) => rating.name == skill).rating :
          0;
        const pR = peerRating.find((rating) => rating.name == skill) ?
          peerRating.find((rating) => rating.name == skill).rating :
          0;
        const pRC = peerRatingCount.find((rating) => rating.name == skill) ?
          peerRatingCount.find((rating) => rating.name == skill).rating :
          1;
        const meR = mentorRating.find((rating) => rating.name == skill) ?
          mentorRating.find((rating) => rating.name == skill).rating :
          0;
        const maR = managerRating.find((rating) => rating.name == skill) ?
          managerRating.find((rating) => rating.name == skill).rating :
          0;
        result[index] = {
          skill: skill.name,
          id:skill.id,
          rating: ((sR * 1) + ((pR / pRC) * 1.5) + (meR * 2.5) + (maR * 1.75)) /
            ((pR ? 1.5 : 0) + (1) + (meR ? 2.5 : 0) + (maR ? 1.75 : 0)),
        };
      });
      console.log(result)
      return res.send(result);
    })
    .catch((err) => res.status(400).send(err));
};

// exports.deleteRatingByUserBySkill = async (req, res, next) => {
//   await Skill.findByIdAndDelete({_id : req.params.id })
//     .then((item) => res.send({ _id: item._id }))
//     .catch((err) => res.status(400).send(err));
// };
