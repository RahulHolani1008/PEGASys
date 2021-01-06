import api from "./api.service";
import functions from "./functions";
import Vue from "vue";
export default new Vue({
    methods: {
        async fetchAllClients() {
            const res = await api().get("/clients/all");
            return functions.validate(res);
        },
        async fetchClientByID(id) {
            const res = await api().get("/clients/"+id)
            return functions.validate(res);
        },
        async addClient(data) {
            const res = await api().post("/clients/addClient", data);
            return functions.validate(res);
        },
    }
})