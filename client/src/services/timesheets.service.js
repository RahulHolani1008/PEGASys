import api from "./api.service";
import functions from "./functions";
import Vue from "vue";
export default new Vue({
    methods: {
    async fetchMyTimeSheets(id){
       const res = await api().get(`timesheets/all/`+id)
        return functions.validate(res);
    },
    async getTimeSpentByUser(id, startDate, endDate) {
        const data = {
            startDate: startDate,
            endDate: endDate
        }
        const res = await api().post(`timesheets/user/project/dateRange/`+id, data)
        return functions.validate(res);
    },
    async fetchProjectsTimeSheets(userId) {
        const res = await api().post("timesheets/all/projects",{userId: userId})
        return functions.validate(res);
    },
    async fetchAllTimeSheetsByUserIdByDay(id, date) {
        const data = {
            date: date
        }
        const res = await api().post(`timesheets/user/day/`+id, data)
        return functions.validate(res);
    },
    async fetchMenteesTimeSheets(id) {
        const res = await api().post("timesheets/all/mentees/"+id)
        return functions.validate(res);
    },
     async fetchManageesTimeSheets(data) {
        const res = await api().post("timesheets/all/managees",data)
        return functions.validate(res);
    },
    async addTimeSheets(data) {
        const res = await api().post("timesheets/addMultiple", data)
        return functions.validate(res);
    },
    async fetchAllTimeSheets() {
        const res = await api().get("timesheets/all")
        return functions.validate(res);
    },
     async editTimesheet(data) {
        const res = await api().post("timesheets/editTimeSheets",data)
        return functions.validate(res);
    },
    async approveTimeSheetForDay(objdata) {
        const data = {
            isApproved: objdata.isApprove,
            date: objdata.sheetsDate
        }
        const res = await api().post("timesheets/approve/day/"+objdata.userId, data);
        return functions.validate(res);
    }  
}
})