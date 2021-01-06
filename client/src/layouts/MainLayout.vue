<template>
  <div v-if="$route.path != '/login'" class="topbar_bg">
    <Sidebar />
    <div style="position: absolute; top: 2px; left: -10px; z-index: 999999">
      <img
        src="../../public/Pegasys.png"
        alt=""
        class="responsive-img-footer"
        style="width: 110px"
      />
    </div>
    <!-- <Calendar /> -->
  </div>
  <div v-else>
    <router-view />
  </div>
</template>
<script>
import Sidebar from "./Sidebar";
// import Calendar from "../components/Calendar.vue";

import functions from "../services/functions";
export default {
  components: {
    Sidebar,
    // Calendar,
  },
};
</script>
<style>
.topbar_bg {
  background: url("../assets/topbar.png");
  background-size: contain;
  background-position: top left;
  background-repeat: no-repeat;
  padding-top: 50px;
}
</style>