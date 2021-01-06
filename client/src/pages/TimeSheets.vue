<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      class="window-height"
      style="margin-left: -20px; height: 88vh !important"
    >
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-primary gen_tabs q-pt-xl">
          <q-tab
            @click="loadMyTimeSheets"
            name="Mine"
            icon="person_outline"
            label="My TimeSheets"
            class="q-mt-md"
          />
          <q-tab
            @click="loadMyMenteesTimeSheets"
            name="My Mentees"
            icon="people_outline"
            label="My Mentees"
            v-if="$store.getters.userType != 'user'"
          />
          <q-tab
            @click="loadMyProjectsTimeSheets"
            name="My Projects"
            icon="o_engineering"
            label="My Projects"
          />
          <q-tab
            @click="loadMyManageesTimeSheets"
            name="My Managees"
            icon="people_outline"
            label="My Managees"
            v-if="
              $store.getters.userType == 'admin' ||
              $store.getters.userType == 'manager'
            "
          />
          <q-tab
            @click="loadAllTimeSheets"
            name="AllSheets"
            icon="o_groups"
            label="All TimeSheets"
            v-if="$store.getters.userType == 'admin'"
          />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="AllSheets">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <div class="q-ml-sm text-h4">All TimeSheets</div>
            </div>
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="projectFilter"
                class="q-ma-sm col-3"
                label="Search by Project"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
              <q-select
                outlined
                class="q-ma-sm col-3"
                v-model="statusFilter"
                :options="['Approved', 'Pending', 'Rejected']"
                label="Search by Status"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-input
                outlined
                class="q-ma-sm col-3"
                v-model="dateFilterConverted"
                label="Search by Date Range"
                lazy-rules
                dense
                clearable
                @clear="dateFilter = null"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dateFilter" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <TimeSheet
                v-for="(timesheet, index) in timeSheetsToDisplay"
                :key="String(timesheet.date) + index"
                :timesheet="timesheet"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="Mine">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <div class="q-ml-sm text-h4">My TimeSheets</div>
              <AddTimeSheet
                v-on:close="loadMyTimeSheets"
                @openTimesheetModal="openAddTimesheet"
                @layoutTimeSheet="layoutTimeSheet"
                :timesheetModal="timesheetModal"
              />
            </div>

            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="projectFilter"
                class="q-ma-sm col-3"
                label="Search by Project"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
              <q-select
                outlined
                class="q-ma-sm col-3"
                v-model="statusFilter"
                :options="['Approved', 'Pending', 'Rejected']"
                label="Search by Status"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-input
                outlined
                class="q-ma-sm col-3"
                v-model="dateFilterConverted"
                label="Search by Date Range"
                lazy-rules
                dense
                clearable
                @clear="dateFilter = null"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dateFilter" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <TimeSheet
                tabType="My TimeSheets"
                v-for="(timesheet, index) in timeSheetsToDisplay"
                :key="String(timesheet.date) + index"
                :timesheet="timesheet"
                v-on:resetData="callAPI"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="My Mentees">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <div class="q-ml-sm text-h4">My Mentees</div>
            </div>
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="projectFilter"
                class="q-ma-sm col-3"
                label="Search by Project"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
              <q-select
                outlined
                class="q-ma-sm col-3"
                v-model="statusFilter"
                :options="['Approved', 'Pending', 'Rejected']"
                label="Search by Status"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-input
                outlined
                class="q-ma-sm col-3"
                v-model="dateFilterConverted"
                label="Search by Date Range"
                lazy-rules
                dense
                clearable
                @clear="dateFilter = null"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dateFilter" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <TimeSheet
                userType="mentor"
                v-for="(timesheet, index) in timeSheetsToDisplay"
                :key="String(timesheet.date) + index"
                :timesheet="timesheet"
                @approveUserTimeSheetData="approveUsersTmeSheet"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="My Projects">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <div class="q-ml-sm text-h4">My Projects</div>
            </div>
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="projectFilter"
                class="q-ma-sm col-3"
                label="Search by Project"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
              <q-select
                outlined
                class="q-ma-sm col-3"
                v-model="statusFilter"
                :options="['Approved', 'Pending', 'Rejected']"
                label="Search by Status"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-input
                outlined
                class="q-ma-sm col-3"
                v-model="dateFilterConverted"
                label="Search by Date Range"
                lazy-rules
                dense
                clearable
                @clear="dateFilter = null"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dateFilter" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <TimeSheet
                userType="user"
                v-for="(timesheet, index) in timeSheetsToDisplay"
                :key="String(timesheet.date) + index"
                :timesheet="timesheet"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="My Managees">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <div class="q-ml-sm text-h4">My Managees</div>
            </div>
            <div
              class="row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="projectFilter"
                class="q-ma-sm col-3"
                label="Search by Project"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
              <q-select
                outlined
                class="q-ma-sm col-3"
                v-model="statusFilter"
                :options="['Approved', 'Pending', 'Rejected']"
                label="Search by Status"
                lazy-rules
                clearable
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-input
                outlined
                class="q-ma-sm col-3"
                v-model="dateFilterConverted"
                label="Search by Date Range"
                lazy-rules
                dense
                clearable
                @clear="dateFilter = null"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dateFilter" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <TimeSheet
                userType="mentor"
                v-for="(timesheet, index) in timeSheetsToDisplay"
                :key="String(timesheet.date) + index"
                :timesheet="timesheet"
                @approveUserTimeSheetData="approveUsersTmeSheet"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script>
import functions from "../services/functions";
import timesheets from "../services/timesheets.service";
import AddTimeSheet from "../components/AddTimeSheet.vue";
import TimeSheet from "../components/TimeSheet.vue";
import moment from "moment";
export default {
  components: {
    AddTimeSheet,
    TimeSheet,
  },
  created() {
    this.loadMyTimeSheets();
  },
  data() {
    return {
      tab: "Mine",
      viewingPending: false,
      viewingUnapproved: false,
      dateFilter: null,
      projectFilter: "",
      statusFilter: "",
      card: false,
      timeSheetsToDisplay: [],
      splitterModel: 12,
      timesheetModal: false,
      timeSheets: [
        {
          date: null,
          user: "",
          data: [],
          color: "",
          border: "",
        },
      ],
      riddler:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/1200px-Question_Mark.svg.png",
      columns: [
        {
          name: "Project",
          required: true,
          label: "Project",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "Time",
          required: true,
          label: "Time Spent",
          align: "center",
          field: (row) => row.time,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
    };
  },
  watch: {
    projectFilter: function (newVal) {
      this.filter();
    },
    statusFilter: function (newVal) {
      this.filter();
    },
    dateFilter: function (newVal) {
      this.filter();
    },
  },
  computed: {
    dateFilterConverted: {
      get() {
        if(this.dateFilter) {
          if(this.dateFilter.from) {
            return this.dateFilter.from + " - " + this.dateFilter.to;
          } else {
            return this.dateFilter+ " - "+this.dateFilter;
          }
        } else {
          return ""
        }
      }
    },
  },
  methods: {
    layoutTimeSheet() {
      console.log("in the layouttimesheet close");
      this.timesheetModal = false;
    },
    callAPI() {
      this.loadMyTimeSheets();
    },
    getLayout() {
      this.layout = false;
    },
    openAddTimesheet() {
      this.timesheetModal = true;
    },
    filter() {
      this.timeSheetsToDisplay = this.timeSheets;
      this.filterByDateRange();
      this.filterByProject();
      this.filterByStatus();
    },
    filterByProject() {
      this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(
        (timesheet) => {
          return (
            timesheet.data.filter((data) => {
              return data.name
                .toLowerCase()
                .includes(this.projectFilter.toLowerCase());
            }).length > 0
          );
        }
      );
    },
    filterByDateRange() {
      if (this.dateFilter) {
        let dateObject;
        let dateObject2;
        if(this.dateFilter.to){
          dateObject = new Date(this.dateFilter.to);
          dateObject.setDate(dateObject.getDate() + 1);
        } else {
          dateObject = new Date(this.dateFilter);
          dateObject2 = new Date(this.dateFilter);
          dateObject2.setDate(dateObject.getDate() + 1);
        }

        this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(timesheet => this.dateFilter.from ? moment(timesheet.date).isBetween(this.dateFilter.from, dateObject) : moment(timesheet.date).isBetween(dateObject,dateObject2));
        console.log(this.timeSheetsToDisplay);
      }
    },
    filterByStatus() {
      this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(
        (timesheet) => {
          return timesheet.status
            .toLowerCase()
            .includes(this.statusFilter.toLowerCase());
        }
      );
    },
    convertTime(time) {
      let hour =
        time / 60 < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
      let minute = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return hour + ":" + minute;
    },

    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    close() {
      this.addModalOpen = false;
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
        mentor: {
          name: project.mentor
            ? project.mentor.firstName + " " + project.mentor.lastName
            : "NO MENTOR",
        },
        date: project.reportDate,
        user: {
          user_id: project.user._id,
          user_name: project.user.firstName + " " + project.user.lastName,
        },
        data: [
          {
            name: project.project.name,
            time: project.time ? project.time : totalProjectSpentTime,
            sheets: sheet,
          },
        ],
        color: project.isApproved
          ? "primary"
          : project.isRejected
          ? "negative"
          : "warning",
        border: project.isApproved
          ? "border-primary"
          : project.isRejected
          ? "border-danger"
          : "border-warning",
        status: project.isApproved
          ? "Approved"
          : project.isRejected
          ? "Rejected"
          : "Pending",
      });
      return arr;
    },
    addToArrayIfNotExist2(arr, project) {
      let sheet = [];
      let totalProjectSpentTime = 0;
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
            this.convertDate(arr[index].date) &&
          project.user._id == arr[index].user.user_id
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
        date: project.reportDate,
        mentor: {
          name: project.mentor
            ? project.mentor.firstName + " " + project.mentor.lastName
            : "NO MENTOR",
        },
        user: {
          user_id: project.user._id,
          user_name: project.user.firstName + " " + project.user.lastName,
        },
        data: [
          {
            name: project.project.name,
            time: project.time ? project.time : totalProjectSpentTime,
            sheets: sheet,
          },
        ],
        color: project.isApproved
          ? "primary"
          : project.isRejected
          ? "negative"
          : "warning",
        border: project.isApproved
          ? "border-primary"
          : project.isRejected
          ? "border-danger"
          : "border-warning",
        status: project.isApproved
          ? "Approved"
          : project.isRejected
          ? "Rejected"
          : "Pending",
      });
      return arr;
    },
    async loadAllTimeSheets() {
      this.$q.loading.show();
      let result = await timesheets.fetchAllTimeSheets();
      this.timeSheets = [];
      result.data.forEach((timeSheet) => {
        timeSheet.date = new Date(timeSheet.reportDate);
        this.timeSheets = this.addToArrayIfNotExist2(
          this.timeSheets,
          timeSheet
        );
      });
      this.timeSheetsToDisplay = this.timeSheets;
      this.$q.loading.hide();
    },
    async loadMyTimeSheets() {
      this.dateFilter = null;
      // alert("YES");
      this.$q.loading.show();
      let result = await timesheets.fetchMyTimeSheets(
        this.$store.getters.userId
      );
      // console.log(result.data);
      this.timeSheets = [];
      result.data.forEach((timeSheet) => {
        timeSheet.date = new Date(timeSheet.date);
        this.timeSheets = this.addToArrayIfNotExist(this.timeSheets, timeSheet);
      });
      this.timeSheetsToDisplay = this.timeSheets;
      this.$q.loading.hide();
    },
    async loadMyProjectsTimeSheets() {
      this.$q.loading.show();
      let result = await timesheets.fetchProjectsTimeSheets(
        this.$store.getters.userId
      );
      this.timeSheets = [];
      result.data.forEach((timeSheet) => {
        timeSheet.date = new Date(timeSheet.date);
        this.timeSheets = this.addToArrayIfNotExist2(
          this.timeSheets,
          timeSheet
        );
      });
      this.timeSheetsToDisplay = this.timeSheets;
      this.$q.loading.hide();
    },
    async loadMyMenteesTimeSheets() {
      this.dateFilter = null;
      this.$q.loading.show();
      let result = await timesheets.fetchMenteesTimeSheets(
        this.$store.getters.userId
      );
      this.timeSheets = [];
      result.data.forEach((timeSheet) => {
        timeSheet.date = new Date(timeSheet.date);
        this.timeSheets = this.addToArrayIfNotExist2(
          this.timeSheets,
          timeSheet
        );
      });
      this.timeSheetsToDisplay = this.timeSheets;
      this.$q.loading.hide();
    },
    async loadMyManageesTimeSheets() {
      this.dateFilter = null;
      this.$q.loading.show();
      const departments = [];
      this.$store.getters.user.departments.forEach((dept) => {
        departments.push(dept._id);
      });
      let result = await timesheets.fetchManageesTimeSheets({
        departments: departments,
        userId: this.$store.getters.userId,
        mentor: this.$store.getters.mentor,
      });
      this.timeSheets = [];
      result.data.forEach((timeSheet) => {
        timeSheet.date = new Date(timeSheet.date);
        this.timeSheets = this.addToArrayIfNotExist2(
          this.timeSheets,
          timeSheet
        );
      });
      this.timeSheetsToDisplay = this.timeSheets;
      this.$q.loading.hide();
    },
    async viewPending() {
      this.viewingPending = true;
      const result = await timesheets.fetchMenteesTimeSheets(
        this.$store.getters.userId
      ).data;
      this.timeSheets = [];
      result.data.forEach((timeSheet) => {
        timeSheet.date = new Date(timeSheet.date);
        this.timeSheets = this.addToArrayIfNotExist2(
          this.timeSheets,
          timeSheet
        );
      });
      this.timeSheetsToDisplay = this.timeSheets;
      this.$q.loading.hide();
      this.filterByDateRange();
    },
    async approveUsersTmeSheet(objectData) {
      this.$q.loading.show();
      await timesheets.approveTimeSheetForDay(objectData);
      if (this.tab == "My Mentees") await this.loadMyMenteesTimeSheets();
      else await this.loadMyManageesTimeSheets();
      this.filterByDateRange();
      this.$q.loading.hide();
    },
  },
  mounted() {
    let path = this.$route.path.split("/");
    path = path[path.length - 1];
  },
};
</script>