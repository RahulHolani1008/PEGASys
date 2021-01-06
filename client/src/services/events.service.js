 import api from "./api.service";
 import functions from "./functions";
 import Vue from "vue";
 export default new Vue({
     methods: {
        async fetchUpcomingEvents(){
            const res = await api().get("/events/allUpcomingEvents");
            functions.validate(res);
        }
    }
})