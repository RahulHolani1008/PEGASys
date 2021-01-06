import api from "./api.service";
import functions from "./functions";
import Vue from "vue";
export default new Vue({
    methods : {
    async fetchAllClientsProjects() {
        const res = await api().get("/projects/allProjectsWithClients");
        return functions.validate(res);
    },
    async fetchAllProjects() {
        const res = await api().get("/projects/all");
        return functions.validate(res);
    },
    async getClients() {
        const res = await api().get("/projects/allClients");
        return functions.validate(res);
    },
    async addProject(data){
        const res = await api().post("/projects/addProject", data);
        return functions.validate(res);
    },
    async editProject(id, data){
        const res = await api().put("/projects/updateProject/"+id, data);
        return functions.validate(res);
    }
} 
})