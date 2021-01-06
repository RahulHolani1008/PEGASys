import api from "./api.service";
import Vue from "vue";
export default new Vue({
    methods: {
        async login(userData){
            return await api().post("/users/loginUser",userData);
        }
    }
})