<template>
  <div id="q-app">
    <MainLayout />
    <q-dialog
      v-model="userDataChanged"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-negative text-white login-error">
        <q-card-section>
          <div class="text-h6">
            <q-icon name="warning" class="text-white" style="font-size: 2rem" />
            User Data changed
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          We noticed that your user's data was changed. Please re-login to
          continue. Sorry for the inconvinence.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat color="negative" label="OK" @click="confirmedChange" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style>
#q-app {
  background: linear-gradient(
    180deg,
    #93be3b -600.89%,
    rgba(255, 255, 255, 0) 100%
  ) !important;
}
</style>
<script>
import MainLayout from "./layouts/MainLayout.vue";
import general from "./services/general.service";
import usersService from "./services/users.service";
export default {
  name: "App",
  components: {
    MainLayout,
  },
  methods: {
    confirmedChange() {
      this.logout();
      this.$router.push("/login");
      this.userDataChanged = false;
    },
    async getMentees() {
      if (
        this.$store.getters.isAuthenticated &&
        (this.$store.getters.userType == "mentor" ||
          this.$store.getters.userType == "manager" ||
          this.$store.getters.userType == "admin")
      ) {
        const result = await usersService.getMyMentees(
          this.$store.getters.userId
        );
        const mentees = result.data;
        const user = this.$store.getters.user;
        user.mentees = mentees;
        this.$store.commit("setUser", user);
      }
    },
    async getUser() {
      if (this.$store.getters.isAuthenticated) {
        const result = await usersService.fetchUserByID(
          this.$store.getters.userId
        );
        console.log(result.data[0]);
        const user = result.data[0];
        if (user.deleted || user.userType != this.$store.getters.userType) {
          this.userDataChanged = true;
        } else {
          this.$store.commit("setUser", result.data[0]);
        }
      }
    },
    logout() {
      localStorage.removeItem("vuex");
      this.$store.commit("setLogout", false);
      this.$store.commit("setUser", null);
      this.$store.commit("setToken", null);
    },
  },
  data() {
    return {
      userDataChanged: false,
    };
  },
  computed: {
    logoutVal() {
      return this.$store.getters.logout;
    },
  },
  watch: {
    logoutVal: function (newVal) {
      if (newVal) {
        console.log("YO DAWG");
        this.userDataChanged = true;
      }
    },
  },
  async mounted() {
    await this.getUser();
    await this.getMentees();
  },
};
</script>