import api from "./api.service";
import functions from "./functions";
import Vue from "vue";
export default new Vue({
methods : {
async fetchAllSkillDepartments(){
       const res = await api().get(`skillDepartments/all`)
        return functions.validate(res);
 },
async fetchAllSkillDepartmentById(id){
       const res = await api().get(`skillDepartments/`+id)
        return functions.validate(res);
 },
}
})