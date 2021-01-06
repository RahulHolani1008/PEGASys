<template>
  <div>
    <div>
      <q-dialog :persistent="true" v-model="layout">
        <q-card class="add-modal-timesheet q-pa-md">
          <div><span class="fs--18">Apply for leave</span></div>
          <q-form @submit="onSubmit">
            <div class="q-pt-sm">
              <q-card-section class="q-pa-none">
                <div class="row align-item-center">
                  <div class="col-md-5 col-sm-5 col-xs-12 text-h6">
                    <q-input
                      outlined
                      label="From"
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
                  <div class="col-md-2 col-sm-2 col-xs-12 text-center">
                    <span class="fs--24">to</span>
                  </div>
                  <div class="col-md-5 col-sm-5 col-xs-12 text-h6">
                    <q-input
                      outlined
                      label="To"
                      v-model="dateDisplayTo"
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
                            <q-date
                              v-model="dateTo"
                              minimal
                              :options="optionsFnTo"
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
            <div class="col-md-5 col-sm-5 col-xs-12 text-h6">
              <div>
                <q-input
                  style="height: 120px; border-radius: 4%"
                  outlined
                  type="textarea"
                  placeholder="Reason for leave"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                />
              </div>
            </div>
            <div>
              <div class="fs--24">Current leave balance : 6</div>
              <div class="fs--24">Remaining leave balance : 4</div>
            </div>

            <div>
              <q-card-actions class="justify-end fs--18">
                <q-btn
                  color="white"
                  textColor="primary"
                  flat
                  label="cancel"
                  @click="onClose"
                />
                <q-btn type="submit" color="primary" label="Apply for leave" />
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
export default {
  components: {},

  data() {
    return {
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
      dateTo: "",
      dateDisplay: "",
      dateDisplayTo: "",
      formData: [],
    };
  },
  watch: {
    selectedOptions: function (value) {},
    formData: {
      handler: function (newValue) {
        //alert(this.totalTime);
      },
    },

    date: function (value) {
      this.dateDisplay = value.split("/").reverse().join("/");
      var d = value.split("/").reverse();
      var x = d[0];
      d[0] = d[1];
      d[1] = x;
      this.requestDate = d.join("/");
    },
    dateTo: function (value) {
      this.dateDisplayTo = value.split("/").reverse().join("/");
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
      this.layout = true;
      this.getAllTimesheet();
      this.dateDisplay = "";
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
    async onSubmit() {},

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
      return date >= currentDate;
    },

    optionsFnTo(date) {
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
      return date >= currentDate && date >= this.date;
    },

    onClose() {
      this.$emit("close");
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

      this.dateDisplay = dd + "/" + mm + "/" + yy;
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
  },
  props: ["layout"],

  mounted() {
    this.todayDate();
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
  border-radius: 4%;
  border: 2px solid black;
  height: fit-content;
  max-height: 85vh;
  width: 100%;
  max-width: 800px;
}
</style>
