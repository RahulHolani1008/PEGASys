<template>
  <div
    v-bind:class="{
      'add-timesheet-scroll': $route.path != '/',
      'add-timesheet-dashboard q-ml-md q-mt-sm': $route.path == '/',
    }"
  >
    <!-- <q-btn label="Add Timesheet" color="primary" @click="layoutTrue" /> -->
    <q-btn
      v-if="this.$route.path === '/daily-reports'"
      label="Add Timesheet"
      color="primary"
      @click="layoutTrue"
    />

    <div>
      <q-dialog :persistent="true" v-model="layoutTimeSheet">
        <q-card class="add-modal-timesheet q-py-sm">
          <q-form @submit="onSubmit">
            <div>
              <q-card-section>
                <div class="row">
                  <div class="col-md-7 col-sm-7 col-xs-12 text-h6">
                    Add Timesheet
                  </div>
                  <div class="col-md-5 col-sm-5 col-xs-12 text-h6">
                    <q-input
                      outlined
                      label="Select Date"
                      readonly
                      v-model="dateDisplay"
                      lazy-rules
                      dense
                      :rules="TDRequired"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="date" minimal :options="optionsFn">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Ok"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-form>
        </q-card>
      </q-dialog>
    </div>

    <div>
      <q-dialog :persistent="true" v-model="layoutTimeSheet">
        <q-card class="add-modal-timesheet q-py-sm">
          <q-form @submit="onSubmit">
            <div>
              <q-card-section>
                <div class="row">
                  <div class="col-md-7 col-sm-7 col-xs-12 text-h6">
                    Add Timesheet
                  </div>
                  <div class="col-md-5 col-sm-5 col-xs-12 text-h6">
                    <q-input
                      outlined
                      v-model="dateDisplay"
                      lazy-rules
                      readonly
                      label="Select Date"
                      dense
                      :rules="TDRequired"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-if="!open"
                              v-model="date"
                              minimal
                              :options="optionsFn"
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Ok"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </div>

            <div class="row q-mx-md q-mysm">
              <div class="col-md-6 col-sm-6 col-xs-12">
                <SelectProject class="col-md-6" v-on:projects="getProjects" />
              </div>
              <div
                v-if="totalTime > 0"
                class="col-md-6 col-sm-6 col-xs-12 q-pt-sm"
              >
                <label class="float-right text-h6">
                  {{ hours }}:{{ minutes }} Hours
                </label>
              </div>
            </div>

            <div style="max-height: 250px; overflow-y: auto">
              <q-card
                v-for="project in formData"
                :key="project.label"
                class="q-mx-lg q-my-md"
                style="border-radius: 15px"
              >
                <q-card-section>
                  <div class="fs--16">
                    {{ getTitleFirstLetter(project.label) }}
                  </div>
                  <div
                    class="row"
                    v-for="(detail, idx) in project.detail"
                    :key="detail.detailId"
                  >
                    <div class="col-8">
                      <div class="q-pr-md q-py-md">
                        <q-input
                          style="margin-top: -15px"
                          v-model="detail.description"
                          outlined
                          type="textarea"
                          placeholder="Description"
                          autogrow
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Please type something',
                          ]"
                        />
                      </div>
                    </div>
                    <div class="col-4">
                      <div>
                        <q-input
                          outlined
                          placeholder="hh:mm"
                          v-model="detail.timeSpent"
                          mask="time"
                          :rules="[
                            (val) =>
                              val != '00:00' || 'time should be more than 0',
                            (val) =>
                              totalTime < 1440 ||
                              'Please enter time < 24 hours',
                            (val) => !!val || 'Please enter time spent on task',
                            'time',
                          ]"
                        >
                        </q-input>
                      </div>

                      <div class="q-pb-sm" style="float: right">
                        <q-btn
                          v-if="idx > 0"
                          round
                          color="red"
                          icon="delete"
                          @click="remove(project.projectId, detail.detailId)"
                        />
                        <q-btn
                          round
                          color="primary"
                          v-if="project.detail.length - 1 == idx"
                          icon="add"
                          class="q-ml-md"
                          @click="add(project.projectId)"
                        />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <!-- <q-separator class="q-mt-sm" /> -->
            <div>
              <q-card-actions class="justify-end">
                <q-btn
                  color="white"
                  textColor="primary"
                  flat
                  label="cancel"
                  @click="onClose"
                />
                <q-btn
                  v-if="formData.length > 0"
                  type="submit"
                  flat
                  color="primary"
                  label="Submit"
                />
              </q-card-actions>
            </div>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import axios from "axios";

import SelectProject from "./TimeSheets/SelectProject.vue";
import timesheetsService from "../services/timesheets.service";
// import SelectBox from './TimeSheets/selectBox.vue';
var detailId = 0;
import functions from "../services/functions";
export default {
  components: {
    // SelectBox,
    SelectProject,
  },
  props: ["selectedDatefromDashboard", "open","layoutTimeSheet", "timesheetModal"],
  // created()
  //   SelectBox{
  //   this.date = moment(new Date()).format("YYYY/MM/DD");
  // },
  data() {
    return {
      path: "",
      hours: "",
      minutes: "",
      existDate: [],
      dateValidation: [],
      projectDescription: [],
      today: new Date(),
      requestDate: "",
      index: 0,
      preDate: "",
      totalTime: 0,
      timeSpent: "",
      selectedOptions: [],
      date: new Date(),
      dateDisplay: "",
      formData: [],
    };
  },
  watch: {
    open: function (value) {
      if (value) {
        this.date = this.selectedDatefromDashboard;
        this.layoutTimeSheet = this.layoutTimeSheet;
      }
    },
    selectedDatefromDashboard: function(newVal){
      this.date = newVal;
    },
    timesheetModal: function(value){
      if(value){
        this.layoutTimeSheet = true;
      }else if(!value){
        this.layoutTimeSheet = false;
      }
    },
    selectedOptions: function (value) {},
    formData: {
      handler: function (newValue) {
        this.totalTime = 0;
        newValue.forEach((data) => {
          data.detail.forEach((detailData) => {
            const hours = detailData.timeSpent.substring(0, 2);
            const minutes = detailData.timeSpent.substring(3, 5);

            this.totalTime += Number(hours) * 60 + Number(minutes);
            //console.log(this.totalTime);
            this.hours =
              Math.floor(Number(this.totalTime) / 60) > 9
                ? Math.floor(Number(this.totalTime) / 60)
                : "0" + Math.floor(Number(this.totalTime) / 60);
            this.minutes =
              Math.floor(Number(this.totalTime) % 60) > 9
                ? Math.floor(Number(this.totalTime) % 60)
                : "0" + Math.floor(Number(this.totalTime) % 60);
          });
        });
        //alert(this.totalTime);
      },
      deep: true,
    },

    date: function (value) {
      this.dateDisplay = value.split("/").reverse().join("/");
      var d = value.split("/").reverse();
      var x = d[0];
      d[0] = d[1];
      d[1] = x;
      this.requestDate = d.join("/");
    },
  },
  computed: {
    TDRequired() {
      return [(v) => !!v || "Date is required."];
    },
  },
  methods: {
    layoutTrue() {
      this.$emit('openTimesheetModal')
      this.getAllTimesheet();
      this.dateDisplay = "";
    },
    getTitleFirstLetter: function (value) {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    timeInput(value) {
      if (this.totalTime > 1440) {
        return [(v) => !!totalTime > 1440 || "Date is required."];
      }
    },
    timeConvert(val, detail) {
      var convertedTime = 0;
      var data = val.toString();

      const hours = data.substring(0, 2);
      const minutes = data.substring(3, 5);

      convertedTime = Number(hours) * 60 + Number(minutes);
      this.projectDescription.push({
        description: detail.description,
        timeSpent: convertedTime,
      });
    },
    async onSubmit() {
      // if (this.dateValidation.includes(this.dateDisplay)) {
      //   alert("timesheet already added");
      // } else {
      var user = this.$store.getters.userId;
      var userdata = this.$store.getters.user;

      const requestData = [];

      this.formData.forEach((data) => {
        this.projectDescription = [];
        let timeSpentOnProject = 0;
        data.detail.forEach((detail) => {
          this.timeConvert(detail.timeSpent, detail);
          const hours = detail.timeSpent.substring(0, 2);
          const minutes = detail.timeSpent.substring(3, 5);
          timeSpentOnProject += Number(hours) * 60 + Number(minutes);
        });
        requestData.push({
          user: user,
          reportDate: this.requestDate,
          deleted: false,
          mentor: userdata.mentor,
          project: data.projectId,
          sheets: this.projectDescription,
          time: timeSpentOnProject,
        });
      });
      // alert("destination");
      // console.log(JSON.stringify(requestData));
      const response = await timesheetsService.addTimeSheets(requestData);
      if (response.data == "Invalid Token") {
        alert("Invalid Token");
      }
      this.onClose();
      // console.log(response.data);
    },

    optionsFn(date) {
      var x = (
        this.today.getFullYear() +
        "/" +
        (Number(this.today.getMonth()) + 1) +
        "/" +
        this.today.getDate()
      ).toString();
      var arr = x.split("/");
      if (arr[1] < 10) {
        arr[1] = "0" + arr[1];
      }
      if (arr[2] < 10) {
        arr[2] = "0" + arr[2];
      }

      var currentDate = arr.join("/");
      //alert(this.existDate)

      return (
        date >= this.preDate &&
        date <= currentDate &&
        !this.existDate.includes(date)
      );

      // return date <= d && date>this.preDate;
    },

    getProjects(value) {
      if (value.length < 1) {
        this.formData = [];
      } else {
        value.forEach((val) => {
          if (value.length > this.formData.length) {
            if (this.formData.length > 0) {
              var b = true;
              this.formData.forEach((fdata) => {
                if (fdata.projectId == val.value) {
                  b = false;
                }
              });
            } else {
              this.formData.push({
                projectId: val.value,
                label: val.label,
                detail: [
                  { detailId: detailId, description: "", timeSpent: "" },
                ],
              });
              detailId++;
            }
            if (b) {
              this.formData.push({
                projectId: val.value,
                label: val.label,
                detail: [
                  { detailId: detailId, description: "", timeSpent: "" },
                ],
              });
              detailId++;
            }
          } else {
            this.formData.forEach((fdata, index) => {
              var b = true;
              value.forEach((val) => {
                if (fdata.projectId == val.value) {
                  b = false;
                }
              });
              if (b) {
                this.formData.splice(index, 1);
              }
            });
          }
        });
      }
    },
    remove(pid, detid) {
      this.formData.forEach((val, index) => {
        if (val.projectId == pid) {
          val.detail.forEach((det, i) => {
            if (det.detailId == detid) {
              if (val.detail.length > 1) {
                val.detail.splice(i, 1);
              } else {
                this.formData.splice(index, 1);
              }
            }
          });
        }
      });
    },

    remove(pid, detid) {
      this.formData.forEach((val, index) => {
        if (val.projectId == pid) {
          val.detail.forEach((det, i) => {
            if (det.detailId == detid) {
              if (val.detail.length > 1) {
                val.detail.splice(i, 1);
              } else {
                this.formData.splice(index, 1);
              }
            }
          });
        }
      });
    },
    add(project) {
      this.formData.forEach((data, index) => {
        if (project == data.projectId) {
          // alert(project);
          this.formData[index].detail.push({
            detailId: detailId,
            description: "",
            timeSpent: "",
          });
          detailId++;
        }
      });
      // alert(JSON.stringify(this.formData));
    },
    onClose() {
      this.$emit("layoutTimeSheet");
      console.log("perfectly closed");
    },
    todayDate() {
      var d = new Date();
      var yy, mm, dd;
      if (Number(d.getDate()) < 10) {
        dd = "0" + d.getDate();
      } else {
        dd = d.getDate();
      }
      if (Number(d.getMonth()) + 1 < 10) {
        mm = "0" + (Number(d.getMonth()) + 1);
      } else {
        mm = Number(d.getMonth() + 1);
      }
      yy = d.getFullYear();

      // this.dateDisplay = dd + "/" + mm + "/" + yy;
      this.requestDate = mm + "/" + dd + "/" + yy;

      var future = new Date(); // get today date
      future.setDate(future.getDate() - 7); // add 7 days
      var finalDate =
        future.getFullYear() +
        "-" +
        (future.getMonth() + 1 < 10 ? "0" : "") +
        (future.getMonth() + 1) +
        "-" +
        (future.getDate() < 10 ? "0" : "") +
        future.getDate();
      // alert(finalDate);
      var dateformat = finalDate.split("-");
      finalDate = dateformat.join("/");
      this.preDate = finalDate;
    },
    dateConvert(value) {
      // console.log(value);
      var newDate = [];
      var date = value.substring(0, 10);
      newDate = date.split("-");

      // newDate[0]=newDate[0]>10?newDate[0]:'0'+newDate[0]
      //alert(Number(newDate[2])+1)

      date = newDate.reverse().join("/");

      newDate[0] = Number(newDate[0]);
      newDate[0] = newDate[0] > 9 ? newDate[0] : "0" + newDate[0];
      var da = newDate.reverse().join("/");

      this.existDate.push(da);

      return date;
    },
    async getAllTimesheet() {
      this.existDate = [];
      this.dateValidation = [];
      const response = await timesheetsService.fetchMyTimeSheets(
        this.$store.getters.userId
      );
      response.data.forEach((data) => {
        const date = this.dateConvert(data.reportDate);
        this.dateValidation.push(date);
      });
    },
  },

  mounted() {
    this.todayDate();
    this.getAllTimesheet();
    this.path = this.$route.path.split("/");
    this.path = this.path[this.path.length - 1];
    console.log(this.path);

    //this.preDate = alert(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  },
};
</script>
<style>
.add-timesheet-scroll {
  position: fixed;
  right: 36px;
}
.add-timesheet-dashboard {
  position: relative;
  right: 0px;
}
.q-dialog__inner .add-modal-timesheet {
  height: fit-content;
  max-height: 85vh;
  width: 100%;
  max-width: 800px;
}
</style>
