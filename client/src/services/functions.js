const moment = require('moment');
import store from '../store/index';
import Vue from 'vue';

export default new Vue ({
    methods: {
    convertDateToDate(dateTime) {
        return moment(dateTime).format('MMMM Do YYYY') == "Invalid date" ? null : moment(dateTime).format('MMMM Do YYYY');
    },
    convertDateToDateReverse(dateTime) {
        return moment(dateTime).format();
    },
    convertDateInCalenderFormat(date) {
        var d = new Date(date);
        var year = d.getFullYear();
        var month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
        var sdate = (d.getDate() > 9) ? d.getDate() : '0' + d.getDate();
        return year + "/" + month + "/" + sdate;
    },
    logout() {
        localStorage.removeItem("vuex");
        store.commit("setUser", null);
        store.commit("setToken", null);
    },
    validate(res) {
        if(res.data === "Invalid Token") {
            store.commit("setLogout", 1);
            return;
        } else {
            return res;
        }
    }
}
})