<template>
  <div class="fit row wrap justify-start items-start content-start">
    <div class="q-mr-sm dashboard-calendar">
      <q-date
        color="secondary"
        v-model="date"
        :events="eventsFn"
        :options="optionsFn"
        minimal
        @click.right="dateRightClick"
        :event-color="(date) => colorFn(date)"
        ><q-popup-proxy
          v-model="showPopup"
          transition-show="flip-up"
          :target="selectedTarget"
          transition-hide="flip-down"
        >
          <q-banner>
            <span clas="fs--18 q-mb-sm">{{ selectedDate }}</span>
            <q-list
              bordered
              separator
              padding
              class="rounded-borders full-width"
            >
              <q-item
                clickable
                v-ripple
                v-if="
                  new Date(new Date().setHours(0, 0, 0, 0)).getTime() <
                    new Date(selectedDate).getTime() ||
                  new Date(new Date().setHours(0, 0, 0, 0)).getTime() ===
                    new Date(selectedDate).getTime()
                "
              >
                <q-item-section avatar>
                  <q-avatar
                    color="primary"
                    text-color="white"
                    icon="o_flight_takeoff"
                  ></q-avatar>
                </q-item-section>
                <q-item-section @click="applyLeave">
                  Apply for leave
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                v-if="
                  new Date().setDate(new Date().getDate() - 8) <=
                    new Date(selectedDate).getTime() &&
                  new Date().getTime() >= new Date(selectedDate).getTime() &&
                  !existDate.includes(selectedDate)
                "
                @click="openAddTimesheet"
              >
                <q-item-section avatar>
                  <q-avatar
                    color="primary"
                    text-color="white"
                    icon="event_note"
                  ></q-avatar>
                </q-item-section>
                <q-item-section @click="addSheet()">
                  Add Timesheet
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                v-if="new Date().getTime() > new Date(selectedDate).getTime()"
                @click="$router.push('/daily-reports')"
              >
                <q-item-section avatar>
                  <q-avatar
                    color="primary"
                    text-color="white"
                    icon="o_event"
                  ></q-avatar>
                </q-item-section>
                <q-item-section> View Timesheets </q-item-section>
              </q-item>
            </q-list>
          </q-banner>
        </q-popup-proxy>
      </q-date>
    </div>
    <div class="q-mr-sm dashboard-calendar-text">
      <q-card class="calendar-text">
        <q-card-section class="text-h6">
          {{ date }}
          <span
            v-if="totalProjectTimeByCurrentDate != '00:00'"
            class="float-right"
            >{{ totalProjectTimeByCurrentDate + " hours" }}
          </span>
        </q-card-section>
        <div class="calendar-text-content">
          <q-card-section
            class="q-pt-none q-pb-none"
            v-for="(sdata, index) in sheetData"
            v-bind:key="index"
          >
            <hr />
            <div class="row">
              <div
                class="col-md-9 col-sm-8 col-xs-8 q-pr-sm text-subtitle2 text-left"
              >
                {{ getTitleFirstLetter(sdata.name) }}
              </div>
              <div
                class="col-md-3 col-sm-4 col-xs-4 q-pr-sm text-subtitle2 text-right"
              >
                {{ convertTime(sdata.time) + " hours" }}
              </div>
            </div>
            <div
              class="row"
              v-for="(sheet, index) in sdata.sheets"
              :key="index"
            >
              <div
                class="col-md-9 col-sm-8 col-xs-8 q-pr-sm text-subtitle3 text-left"
              >
                {{ sheet.description }}
              </div>
              <div
                class="col-md-3 col-sm-4 col-xs-4 q-pr-sm text-subtitle3 text-right"
              >
                {{ convertTime(sheet.time) + " hours" }}
              </div>
            </div>
          </q-card-section>
        </div>
        <AddTimeSheet
          :layoutTimeSheet="card"
          @layoutTimeSheet="close"
          :selectedDatefromDashboard="selectedDate"
          :open="open"
          @open="getOpen"
          @close="getOpen"
        />
        <ApplyForLeave :layout="layout" @close="ApplayLeavePopClose" />
      </q-card>
    </div>
  </div>
</template>
<script>
// import { dateFormat } from "highcharts";
import AddTimeSheet from "./AddTimeSheet.vue";
import ApplyForLeave from "../components/Leaves/ApplyForLeave.vue";
import TimesheetsService from "../services/timesheets.service";
import functions from "../services/functions";
// import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "Calendar",
  components: {
    AddTimeSheet,
    ApplyForLeave,
  },
  data() {
    return {
      layout: false,
      open: false,
      splitterModel: "",
      today: moment(),
      lastDateToFillSheet: false,
      showPopup: false,
      selectedTarget: null,
      date:
        new Date().getFullYear() +
        "/" +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getDate(),
      data: null,
      events: [],
      // dates: ["2020/11/08", "2020/11/07", "2020/11/06", "2020/11/05"],
      sheetData: [],
      existDate: [],
      selectedDate: "",
      totalProjectTimeByCurrentDate: "",
      card: false,
    };
  },
  mounted() {
    this.fetchMyTimeSheets();
    this.fetchAllTimeSheetsByUserIdByDay();
  },
  watch: {
    date: async function (newVal) {
      var dateofvisit = moment(newVal, "YYYY/MM/DD");
      if (
        this.today.diff(dateofvisit, "days") > 7 ||
        isNaN(this.today.diff(dateofvisit, "days"))
      ) {
        this.lastDateToFillSheet = true;
      } else {
        this.lastDateToFillSheet = false;
      }
      await this.fetchAllTimeSheetsByUserIdByDay();
    },
  },
  methods: {
    addSheet() {
      this.open = true;
    },
    ApplayLeavePopClose() {
      this.layout = false;
    },
    applyLeave() {
      this.layout = true;
    },
    async fetchMyTimeSheets() {
      const response = await TimesheetsService.fetchMyTimeSheets(
        this.$store.getters.userId
      );
      response.data.forEach((ele) => {
        if (
          !this.existDate.includes(
            this.convertDateInCalenderFormat(ele.reportDate)
          )
        ) {
          this.existDate.push(this.convertDateInCalenderFormat(ele.reportDate));
        }
      });
    },
    async fetchAllTimeSheetsByUserIdByDay() {
      var changedDate = new Date(this.date).toISOString();
      // console.log(changedDate);
      const response = await TimesheetsService.fetchAllTimeSheetsByUserIdByDay(
        this.$store.getters.userId,
        changedDate
      );
      this.sheetData = [];
      response.data.forEach((ele) => {
        if (
          moment(new Date(ele.reportDate)).diff(
            moment(new Date(this.date)),
            "days"
          ) == 0
        )
          this.timeSheets = this.addToArrayIfNotExist(this.sheetData, ele);
      });
      this.totalProjectTimeByCurrentDate = this.TotalTimePerDay();
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    addToArrayIfNotExist(arr, project) {
      var sheet = [];
      var totalProjectSpentTime = 0;
      if (project.sheets.length === 0) {
        project.time = 0;
        sheet.push({
          description: "No Data Available.",
          time: 0,
        });
      } else {
        project.sheets.forEach((elesheet) => {
          totalProjectSpentTime += elesheet.timeSpent;
          sheet.push({
            description: elesheet.description,
            time: elesheet.timeSpent,
          });
        });
      }

      for (let index in arr) {
        if (
          this.convertDate(project.reportDate) ==
          this.convertDate(arr[index].date)
        ) {
          arr[index].data.push({
            name: project.project.name,
            time: project.time ? project.time : totalProjectSpentTime,
            sheets: sheet,
          });
          return arr;
        }
      }

      arr.push({
        name: project.project.name,
        time: project.time ? project.time : totalProjectSpentTime,
        sheets: sheet,
      });
      return arr;
    },
    eventsFn(date) {
      if (
        !this.existDate.includes(date) &&
        date <= this.convertDateInCalenderFormat(new Date())
      ) {
        return true;
      } else if (date <= this.convertDateInCalenderFormat(new Date())) {
        return true;
      }
    },
    dateRightClick(event) {
      console.log("hello");
      console.log(event.path[0].innerText);
      if (
        Number(event.path[0].innerText) <= 31 &&
        Number(event.path[0].innerText) >= 1
      ) {
        console.log(event.path);
        const month = moment()
          .month(event.path[7].children[0].children[1].innerText)
          .format("M");
        const year = event.path[7].children[0].children[4].innerText;
        this.selectedTarget = event.path[0];
        const date =
          Number(this.selectedTarget.innerText) < 10
            ? "0" + this.selectedTarget.innerText
            : this.selectedTarget.innerText;
        this.selectedDate = `${year}/${month}/${date}`;

        this.showPopup = true;
      }
      event.preventDefault();
    },
    colorFn(date) {
      let color = "red";
      const d = new Date(date);
      // console.log(d);
      if (d.getDay() == 0 || d.getDay() == 6) {
        color = "white";
      }
      if (this.existDate.includes(date)) {
        color = "green";
      }
      if (d.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
        color = "white";
      }
      return color;
    },
    optionsFn(date) {
      return true;
    },
    openAddTimesheet() {
      this.showPopup = false;
      this.card = true;
    },
    close() {
      this.card = false;
    },
    getOpen(value) {
      this.open = false;
      this.fetchMyTimeSheets();
      this.fetchAllTimeSheetsByUserIdByDay();
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    convertDateInCalenderFormat(date) {
      var d = new Date(date);
      var year = d.getFullYear();
      var month =
        d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + d.getMonth() + 1;
      var sdate = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
      return year + "/" + month + "/" + sdate;
    },
    TotalTimePerDay() {
      var totalTime = 0;
      this.sheetData.forEach((eleWork) => {
        totalTime += eleWork.time;
      });
      return this.convertTime(totalTime);
    },
    convertTime(time) {
      let hour =
        time / 60 < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
      let minute = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return hour + ":" + minute;
    },
    getTitleFirstLetter: function (value) {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>
<style>
.calendar-text {
  min-height: 376px;
  box-shadow: none;
}
.dashboard-calendar .q-date {
  width: 290px;
  height: 250px;
  min-height: 250px;
  max-height: 100%;
  display: block;
}
.dashboard-calendar .q-date__view {
  padding-right: 0px;
  height: 250px;
  width: 100%;
  min-height: 250px;
  padding: 5px;
}
.dashboard-calendar .q-date__view .q-date__calendar-days-container {
  min-height: 180px;
}
.dashboard-calendar-text {
  width: calc(100% - 340px);
}

/* NOT IN USE */
/*.q-popup-edit {
  width: 30% !important;
  height: 25%;
  top: 10% !important;
  left: 28% !important;
  box-shadow: none;
  position: absolute !important;
}
*/
.calendar-scroll-area {
  height: 118px;
}

.dashboard-calendar-text .calendar-text .text-h6 {
  padding-bottom: 0px;
}
.dashboard-calendar-text .q-card {
  height: 250px;
  min-height: 250px;
  max-height: 100%;
  background: none;
}
.calendar-text-content {
  overflow: overlay;
  height: 150px;
}

@media (max-width: 700px) {
  .dashboard-calendar {
    width: 100%;
  }
  .dashboard-calendar-text {
    margin-top: 2%;
    width: 100%;
  }
  .calendar-scroll-area {
    height: 118px;
  }
}
</style>