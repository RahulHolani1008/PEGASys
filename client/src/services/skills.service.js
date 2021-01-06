import api from "./api.service";
import functions from "./functions";
import Vue from "vue";
export default new Vue({
methods: {
async fetchAllSkills(){
    const res = await api().get(`/skills/all`)
    return functions.validate(res);
},
async addSkill(data) {
    const res = await api().post("/skills/addSkill", data)
    return functions.validate(res);
},
}
})
