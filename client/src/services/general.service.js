 import api from "./api.service";
 import functions from "./functions";
 import Vue from "vue";
 export default new Vue({
     methods: {
 async fetchAllProjects(id){
    const res = await api().get("/projects/all/"+id);
    return functions.validate(res);    
},
    async fetchProjectsByUserId(id){
        const res = await api().get("/projects/"+id);
        return functions.validate(res);
    }
}
})