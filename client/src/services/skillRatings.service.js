import api from "./api.service";
import functions from "./functions";
import Vue from "vue";
export default new Vue({
methods : {
  async fetchRatingsGivenByUserToUser(to, from) {
    const res = await api().get(`/skillRatings/user/` + to + `/` + from)
    return functions.validate(res);
  },

  async fetchRatingsGivenByUserBySkill(skillId, from) {
    const res = await api().get(`/skillRatings/` + skillId + `/` + from)
    return functions.validate(res);
  },

  async fetchAllSkills() {
    const res = await api().get(`/skills/all`)
    return functions.validate(res);
  },

  async fetchAllRatingByUser(id) {
    const res = await api().get(`/skillRatings/user/all/` + id)
    return functions.validate(res);
  },
  async fetchAllRatingBySkill(id){
       const res = await api().get(`/skillRatings/all/`+id)
    return functions.validate(res);
      },

  async fetchAllUsersBySkill(id){
    const res = await api().get(`/skillRatings/all/`+id)
    return functions.validate(res);
  },
  async addSkillsRating(data) {
    console.log(data);
        const res = await api().post("/skillRatings/addRatings", data)
      return functions.validate(res);
      },
  async deleteSkill(data) {
      const res = await api().post("/skillRatings/deleteSkill", data)
    return functions.validate(res);
    },
  }
})
