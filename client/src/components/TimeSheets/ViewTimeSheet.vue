<template>
  <div>
    <div class="q-gutter-sm" style="position: relative">
      <q-dialog :persistent="true" v-model="viewTimesheet">
        <q-card :class="timesheetData.border" class="view-all-timesheet">
          <div>
            <q-card-section>
              <div class="row">
                <div class="col-md-5 col-sm-5 col-xs-12 text-h6">
                  {{ convertDate(timesheetData.date) }}
                </div>
                <div class="col-md-5 col-sm-5 col-xs-12 text-h6">
                  {{ timesheetData.user.user_name }}
                </div>
                <div class="col-md-2 col-sm-2 col-xs-12 text-h6">
                  {{ TotalTimePerDay() + " hours" }}
                </div>
              </div>
            </q-card-section>
          </div>

          <div
            class="row q-mx-md q-my-md"
            v-for="(worksheet, index) in timesheetData.data"
            :key="index"
          >
            <q-table
              style="width: 100%"
              :data="worksheet.sheets"
              hide-bottom
              virtual-scroll
              :hide-pagination="true"
              :rows-per-page-options="[0]"
            >
              <template v-slot:top>
                <div class="col-md-10 float-left fs--18">
                  {{ getTitleFirstLetter(worksheet.name) }}
                </div>
                <q-space />
                <div class="col-md-2 q-pl-lg fs--18">
                  {{ convertTime(worksheet.time) + " hours" }}
                </div>
              </template>

              <template v-slot:body-cell-time="props">
                <q-td :props="props">
                  {{ convertTime(props.row.time) + " hours" }}
                </q-td>
              </template>
            </q-table>
          </div>

          <div>
            <q-card-actions class="justify-end">
              <q-btn
                v-if="
                  timesheetData.color == 'warning' && users.includes(userType)
                "
                icon-right="o_check"
                color="primary"
                class="fs--14"
                flat
                label="Approve"
                @click="requestforSheet(true)"
              ></q-btn>
              <q-btn
                v-if="
                  timesheetData.color == 'warning' && users.includes(userType)
                "
                icon-right="o_cancel"
                color="negative"
                class="fs--14"
                flat
                label="Reject"
                @click="requestforSheet(false)"
              ></q-btn>
              <q-btn
                :color="timesheetData.color"
                flat
                label="Close"
                class="fs--14"
                @click="closeModel"
              />
            </q-card-actions>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import functions from "../../services/functions";
export default {
  methods: {
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    convertTime(time) {
      let hour =
        time / 60 < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
      let minute = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return hour + ":" + minute;
    },
    TotalTimePerDay() {
      var totalTime = 0;
      this.timesheetData.data.forEach((eleWork) => {
        totalTime += eleWork.time;
      });
      return this.convertTime(totalTime);
    },
    closeModel() {
      this.$emit("viewTimesheet", false);
    },
    requestforSheet(value) {
      this.closeModel();
      this.$emit("sheetRequest", value);
      // this.confirmRejectTimesheet = true;
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
    timesheetData: {
      default: {},
    },
    viewModel: {
      default: Boolean,
    },
  },
  watch: {
    viewModel: function (value) {
      this.viewTimesheet = value;
    },
  },
  data() {
    return {
      users: ["mentor", "manager", "admin"],
      viewTimesheet: false,
      // confirmRejectTimesheet: false,
    };
  },
};
</script>

<style>
.q-dialog__inner .view-all-timesheet {
  height: fit-content;
  max-height: 80vh;
  width: 100%;
  max-width: 800px;
}
</style>