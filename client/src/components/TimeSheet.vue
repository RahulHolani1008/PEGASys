<template>
  <q-card
    class="timesheet-card bg-white text-secondary timesheet-card q-ma-sm"
    style="width: 200px; min-height: 220px"
    :class="timesheet.border"
  >
    <div class="q-pl-md q-pt-md">
      <div class="text-subtitle2" style="margin-top: -7px">
        {{ convertDate(timesheet.date) }}
      </div>
      <div class="fs--10" style="margin-top: -3px">
        Mentor: {{ timesheet.mentor.name }}
      </div>
      <div class="fs--10" style="margin-top: -3px">
        By: {{ timesheet.user.user_name }}
      </div>
    </div>
    <div v-if="timesheet.data" class="q-mx-sm">
      <q-table
        style="height: 112px"
        dense
        flat
        hide-bottom
        :data="timesheetTableData"
      />
    </div>
    <q-card-section v-else>
      <q-img height="112px" width="100%" :src="riddler"></q-img>
    </q-card-section>

    <q-separator light inset />

    <q-card-actions class="justify-around">
      <q-btn
        v-if="timesheet.color == 'warning' && users.includes(userType)"
        icon="o_check"
        color="primary"
        class="fs--10"
        flat
        @click="onApprove(true)"
      ></q-btn>
      <q-btn
        v-if="timesheet.color == 'warning' && users.includes(userType)"
        icon="o_cancel"
        color="negative"
        class="fs--10"
        flat
        @click="confirmRejectTimesheet = true"
      ></q-btn>
      <q-btn
        v-if="
          tabType == 'My TimeSheets' &&
          (timesheet.color == 'negative' || timesheet.color == 'warning') &&
          !users.includes(userType)
        "
        icon="o_edit"
        color="secondary"
        flat
        @click="editClicked(timesheet)"
      ></q-btn>
      <q-btn @click="openModel" :color="timesheet.color" class="fs--10">
        View Details
      </q-btn>
    </q-card-actions>
    <EditTimesheet
      :layout="layout"
      :editTimesheet="editTimesheet"
      @layoutFalse="getLayout"
    />

    <ViewTimeSheet
      v-if="timesheet.color == 'warning' && users.includes(userType)"
      userType="mentor"
      :timesheetData="timesheet"
      :viewModel="viewTimesheet"
      @viewTimesheet="closeViewModel"
      @sheetRequest="getMentorRequest"
    />
    <ViewTimeSheet
      v-else
      :timesheetData="timesheet"
      :viewModel="viewTimesheet"
      @viewTimesheet="closeViewModel"
    />

    <ConfirmReject
      :confirmReject="confirmRejectTimesheet"
      @confirmRejectClose="getConfirmRejectClose"
      @rejectUserSheets="onApprove(false)"
    />
  </q-card>
</template>
<script>
import EditTimesheet from "./TimeSheets/EditTimesheet";
import functions from "../services/functions";
import ConfirmReject from "./TimeSheets/ConfirmReject.vue";
import ViewTimeSheet from "./TimeSheets/ViewTimeSheet.vue";

export default {
  components: {
    ViewTimeSheet,
    EditTimesheet,
    ConfirmReject,
  },
  methods: {
    getMentorRequest(value) {
      if (!value) {
        this.confirmRejectTimesheet = true;
      } else {
        this.onApprove(value);
      }
    },
    editClicked(value) {
      this.editTimesheet = value;
      this.layout = true;
    },
    getLayout() {
      this.layout = false;
      this.$emit("resetData", false);
    },
    onApprove(value) {
      this.$emit("approveUserTimeSheetData", {
        userId: this.timesheet.user.user_id,
        sheetsDate: this.timesheet.date,
        isApprove: value,
      });
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    convertTime(time) {
      let hour =
        time / 60 < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
      let minute = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return hour + ":" + minute;
    },
    openModel() {
      this.viewTimesheet = true;
      this.timesheet.data;
    },
    closeViewModel(value) {
      this.viewTimesheet = value;
    },
    getConfirmRejectClose(value) {
      this.confirmRejectTimesheet = value;
    },
    getTitleFirstLetter: function (value) {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },

  props: {
    userType: {
      default: "user",
    },
    timesheet: {
      default: {},
    },
    tabType: {
      default: "",
    },
  },
  watch: {
    timesheet: {
      immediate: true,
      handler: function (value) {
        this.timesheetTableData = [];
        this.timesheet.data.forEach((data) => {
          this.timesheetTableData.push({
            name: this.getTitleFirstLetter(data.name),
            time: this.convertTime(data.time),
          });
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      layout: false,
      editTimesheet: "",
      users: ["mentor", "manager", "admin"],
      viewTimesheet: false,
      confirmRejectTimesheet: false,
      timesheetTableData: [],
    };
  },
};
</script>
<style>
 .q-splitter__before,
 .q-splitter__after{
  overflow: hidden;
 }
</style>