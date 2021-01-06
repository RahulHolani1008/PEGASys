<template>
  <div>
    <div class="row">
      <div class="col-md-3 col-sm-12 col-xs-12 q-px-md">
        <SelectorBox
          v-on:selectedBox="getBox($event)"
          v-on:parentId="getParentId($event)"
        />
        <AddSkill :layout="layout" @layoutFalse="layoutFalse" />
      </div>
      <div
        class="col-md-9 col-sm-12 col-xs-12"
        v-if="userType == 'admin' || userType == 'manager'"
      >
        <q-btn
          style="float: right"
          label="Add Skill"
          color="primary"
          @click="layout = true"
        />
        <div class="row"></div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-3 col-sm-12 col-xs-12 q-px-md q-pt-lg">
        <SelectorList
          v-bind:selectedData="selectedData"
          v-on:userId="getUser($event)"
        />
      </div>
      <div class="col-md-9 col-sm-12 col-xs-12 q-px-md skill-detail-table">
        <SkillsDetail :userId="userId" :pId="pId" />
      </div>
    </div>
  </div>
</template>
<script>
import AddSkill from "../components/Skills/AddSkill.vue";
import SelectorList from "../components/Skills/SelectorList.vue";
import SelectorBox from "../components/Skills/SelectorBox.vue";
import SkillsDetail from "../components/Skills/SkillsDetail.vue";

import functions from "../services/functions";
export default {
  name: "Skills",
  components: {
    SelectorBox,
    SelectorList,
    SkillsDetail,
    AddSkill,
  },
  data() {
    return {
      userType: "",
      layout: false,
      link: "inbox",
      selectedData: [],
      userId: "",
      pId: 100,
    };
  },
  methods: {
    layoutFalse() {
      this.layout = false;
    },
    getBox(value) {
      this.selectedData = value;
    },
    getUser(value) {
      this.userId = value;
    },
    getParentId(value) {
      // alert(value);
      this.pId = value;
    },
  },
  mounted() {
    this.userType = this.$store.getters.userType;
  },
};
</script>
<style>
.my-menu-link {
  color: white;
  background-color: #bdc3c7;
}
@media (max-width: 1024px) {
  .skill-detail-table {
    padding-top: 2%;
  }
}
</style>