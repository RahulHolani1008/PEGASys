<template>
  <div>
    <div class="q-gutter-sm" style="position: relative">
      <!-- <q-btn label="Add Timesheet" color="primary" @click="layout = true" /> -->
      <q-dialog :persistent="true" v-model="layout">
        <q-card class="add-modal-timesheet q-py-sm">
          <q-form @submit="onSubmit">
            <div>
              <q-card-section>
                <div class="row">
                  <div class="col-md-7 col-sm-7 col-xs-12 text-h6">
                    Edit Timesheet
                  </div>
                  <div class="col-md-5 col-sm-5 col-xs-12 text-h6">
                    <q-input
                      outlined
                      v-model="dateDisplay"
                      readonly
                      lazy-rules
                      dense
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </div>

            <div class="row q-mx-md q-mysm">
              <div class="col-md-6 col-sm-6 col-xs-12">
                <!-- <SelectBox  v-on:selectedBox="getBox($event)"/> -->
                <SelectProject
                  v-on:projects="getProjects"
                  :gotProject="gotProject"
                />
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
                :key="project.projectId"
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
                          style="margin-top: -15px; height: 120px"
                          v-model="detail.description"
                          outlined
                          type="textarea"
                          placeholder="Description"
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Please enter a description',
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
                              totalTime <= 1440 ||
                              'Please enter time < 24 hours',
                            (val) => !!val || 'Please enter time spent on task',
                            'time',
                          ]"
                        />
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
                  flat
                  type="submit"
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
import functions from "../../services/functions";
import SelectProject from "./SelectProject";
import timesheetsService from "../../services/timesheets.service";
let detailId = 0;

export default {
  name: "EditTimesheet",
  components: {
    // SelectBox,
    SelectProject,
  },

  data() {
    return {
      hours: "",
      minutes: "",
      sheetData: [],
      timeSheets: [],
      descriptionData: [],
      today: new Date(),
      dateSend: "",
      // index: 0,
      // preDate: "",
      totalTime: 0,
      timeSpent: "",
      // selectedOptions: [],
      // date: new Date(),
      hasRun: false,
      dateDisplay: "",
      finalprojects: [],
      // obj: {
      //   clientId: "",
      //   projectId: "",
      //   detail: [{ detailId: "", description: "", timeSpent: 0 }],
      // },
      // desc: { detailId: "", description: "", timeSpent: 0 },
      formData: [],
      projectList: [],
      propData: [],
      selectedProjects: [],
      gotProject: [],
      // selectedDate: "",
    };
  },
  watch: {
    editTimesheet: {
      handler: async function (value) {
        // alert(JSON.stringify(value))
        this.selectedDate = value.date.substring(0, 10);
        let dd = this.selectedDate.split("-");
        this.selectedDate = dd.join("/");
        // alert(this.selectedDate);
        this.gotProject = [];
        value.data.forEach((data) => {
          this.gotProject.push(data.name.toLowerCase());
        });
        await this.fetchAllTimeSheetsByUserIdByDay(value.date);
        console.log(JSON.stringify(this.timeSheets));
      },
    },
    formData: {
      handler: async function (newValue) {
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
    // selectedOptions: function (value) {},

    // date: function (value) {
    //   this.dateDisplay = this.date.split("/").reverse().join("/");
    //   var d = this.date.split("/").reverse();
    //   var x = d[0];
    //   d[0] = d[1];
    //   d[1] = x;
    //   this.dateSend = d.join("/");
    // },
  },

  methods: {
    getTitleFirstLetter: function (value) {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    async fetchAllTimeSheetsByUserIdByDay(date) {
      const response = await timesheetsService.fetchMyTimeSheets(
        this.$store.getters.userId
      );

      this.timeSheets = [];
      response.data.forEach((ele) => {
        //alert(new Date(ele.reportDate));
        if (moment(new Date(ele.reportDate)).diff(moment(date), "days") == 0) {
          // alert("IN");
          this.timeSheets = this.addToArrayIfNotExist(this.timeSheets, ele);
        }
      });
      this.setFormData();
    },

    setFormData() {
      this.formData = [];
      //alert(JSON.stringify(this.timeSheets))
      this.timeSheets.forEach((sheet, index) => {
        let date = sheet.reportDate.substring(0, 10).split("-");
        this.dateDisplay = date.reverse().join("/");

        this.dateSend = date[1] + "/" + date[0] + "/" + date[2];
        // alert(date)
        this.formData.push({
          projectId: sheet.projectId,
          label: sheet.name,
          detail: [],
        });
        sheet.sheets.forEach((data) => {
          let time = this.convertMinuteTime(data.time);
          this.formData[index].detail.push({
            detailId: data.id,
            description: data.description,
            timeSpent: time,
          });
        });
      });
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
          console.log(project);
          sheet.push({
            description: elesheet.description,
            time: elesheet.timeSpent,
            id: elesheet._id,
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
        projectId: project.project._id,
        reportDate: project.reportDate,
      });
      return arr;
    },
    convertMinuteTime(time) {
      let hours = Math.floor(Number(time) / 60);
      hours = hours > 9 ? hours : "0" + hours;
      let minutes = Number(time) % 60;
      minutes = minutes > 9 ? minutes : "0" + minutes;

      //alert(hours + "  " + minutes);
      return hours + ":" + minutes;
    },

    timeConvert(val, detail) {
      var convertedTime = 0;
      var data = val.toString();

      const hours = data.substring(0, 2);
      const minutes = data.substring(3, 5);

      convertedTime = Number(hours) * 60 + Number(minutes);
      this.descriptionData.push({
        description: detail.description,
        timeSpent: convertedTime,
      });
    },
    async onSubmit() {
      var user = this.$store.getters.userId;
      var userdata = this.$store.getters.user;

      const requestData = [];

      this.formData.forEach((data) => {
        this.descriptionData = [];
        let timeSpentOnProject = 0;
        data.detail.forEach((detail) => {
          this.timeConvert(detail.timeSpent, detail);
          const hours = detail.timeSpent.substring(0, 2);
          const minutes = detail.timeSpent.substring(3, 5);
          timeSpentOnProject += Number(hours) * 60 + Number(minutes);
        });
        requestData.push({
          user: user,
          reportDate: this.dateSend,
          deleted: false,
          mentor: userdata.mentor,
          project: data.projectId,
          sheets: this.descriptionData,
          time: timeSpentOnProject,
          isApproved: false,
          isRejected: false,
        });
      });
      console.log(JSON.stringify(requestData));
      const response = await timesheetsService.editTimesheet(requestData);
      this.onClose();
    },

    getProjects(value) {
      // alert(value);
      if (value.length < 1) {
        this.formData = [];
      } else {
        value.forEach((val) => {
          if (value.length > this.formData.length) {
            if (this.formData.length > 0) {
              var b = true;
              this.formData.forEach((fdata) => {
                if (fdata.label == val.label) {
                  fdata.projectId = val.value;
                  // alert(val.value);
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
                if (fdata.label == val.label) {
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
      if (this.formData !== this.propData && !this.hasRun) {
        this.formData = this.propData;
        this.hasRun = true;
      } else this.propData = [];
    },

    filterFn(val, update, abort, index) {
      return this.projectList;
    },
    selected(opt, index) {
      // alert(opt);
    },
    selectSubGroup(subGroupItem, opt, subIdx, index) {},
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
    },
    onClose() {
      this.$forceUpdate();
      this.$emit("layoutFalse");
    },
  },

  props: ["layout", "editTimesheet"],
};
</script>

<style>
.q-dialog__inner .add-modal-timesheet {
  height: fit-content;
  max-height: 85vh;
  width: 100%;
  max-width: 800px;
}
</style>