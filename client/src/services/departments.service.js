import api from "./api.service";
import functions from "./functions";
import Vue from "vue";

export default new Vue({
    methods: {
        fetchAllDepartment(){
            const res = api().get(`departments/all`);
            return functions.validate(res);
        },
    }
})