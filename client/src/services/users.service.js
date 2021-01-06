import api from "./api.service";
import Vue from 'vue';
import functions from "./functions";
export default new Vue({
    methods: {
    async fetchUsers() {
        const res = await api().get("/users/all");
        return functions.validate(res);
    },
    async fetchUserByID(id) {
        const res = await api().get("/users/"+id)
        return functions.validate(res);
    },
    async updateUserByID(id, editedData, blobFile) {
        const file = new File([blobFile.file], { type: blobFile.file.type })
        var formData = new FormData();
        formData.append("data",JSON.stringify(editedData));
        formData.append("file", file)
        const res = await api().post("users/updateUser/"+id, formData);
        return functions.validate(res);
    },
    async updateUserByIDNoForm(id, editedData) {
        const res = await api().post("users/updateUserNoForm/"+id, editedData);
        return functions.validate(res);
    },
    async addNewUser(data, blobFile) {
        const file = new File([blobFile.file], { type: blobFile.file.type })
        var formData = new FormData();
        formData.append("data",JSON.stringify(data));
        formData.append("file", file)
        const res = await api().post("users/addUser", formData);   
        return functions.validate(res);
    },
    async deleteUser(userId) {
        const res = await api().post("users/deleteUser", {id: userId})
        return functions.validate(res);
    },
    async getMyMentees(userId) {
        const res = await api().post("users/getMentees",{id: userId});
        return functions.validate(res);
    }
}
})