import Vue from "vue";
import Vuex from "vuex";

// import HighchartsVue from "highcharts-vue";
// import Highcharts from "highcharts";
// import mapInit from "highcharts/modules/map";
import createPersistedState from "vuex-persistedstate";
import CryptoJS from 'crypto-js'

const key = '82f2ceed4c503896c8a291e560bd4325' // change to your key
const iv = 'sinasinasisinaaa' // change to your iv
const apiKey = '123xxxyyyzzz' // change to your api key
 
Vue.use(CryptoJS)
Vue.use(Vuex);
// mapInit(Highcharts);
// Vue.use(HighchartsVue);

const aesEncrypt = (txt) => {
  const cipher = CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
  })

  return cipher.toString()
}
const aesDencrypt = (txt) => {
  const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
  })

  return CryptoJS.enc.Utf8.stringify(cipher).toString()
}

export default new Vuex.Store({
  state: {
    user:null,
    token: null,
    logout: false,
  },
  plugins: [createPersistedState()],
  mutations: {
    setToken(state,token){
      if(token) {
        state.token = aesEncrypt(token);
      } else {
        state.token = token;
      }
    },
    setLogout(state, value) {
      state.logout = value;
    },
    setUser(state,user){
      if(user) {
        const u = JSON.stringify(user);
        state.user = aesEncrypt(u);
      } else {
        state.user = user;
      }
    },
    setUserId(state, userId) {
      state.user._id = userId;
    },
    setDepartments(state, departments) {
      state.user.departments = departments;
    },
    setProjects(state,projects){
      state.allProjects=projects;
    },
    // setMentees(state, mentees) {
    //   state.user.mentees = mentees;
    // },
    
  },
  getters: {
    logout(state) {
      return state.logout;
    },
    user(state) {
      if(!state.user)
      return "ERROR";
      const u = aesDencrypt(state.user);
      return JSON.parse(u);
    },
    mentees(state) {
      if(!state.user)
      return "ERROR";
      const u = aesDencrypt(state.user);
      return JSON.parse(u).mentees;
    },
    userId(state) {
      if(state.user) {
        const u = aesDencrypt(state.user);
        return JSON.parse(u)._id;
      }
    },
    mentor(state) {
      if(state.user) {
        const u = aesDencrypt(state.user);
        return JSON.parse(u).mentor;
      }
    },
    token(state) {
      return state.token ? aesDencrypt(state.token) : null;
    },
    isAuthenticated(state) {
      return state.token ? true : false;
    },
    userName(state) {
      if(!state.user)
      return "ERROR";
      const u = aesDencrypt(state.user);
      return JSON.parse(u).userFirstName + " " + JSON.parse(u).userLastName
    },
    userType(state) {
      if(!state.user)
      return "ERROR";
      const u = aesDencrypt(state.user);
      return JSON.parse(u).userType;
    },
    allProjects(state) {
      return state.allProjects;
    },
  },
  actions: {

  },
  modules: {}
});
