<template>
  <div>
    <div>
      <div
        class="q-px-md q-mt-md q-ml-lg q-gutter-sm"
        style="position: relative"
      >
        <q-dialog
          v-model="layout"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <div>
            <q-form @submit="onSubmit" action="./users">
              <q-card style="width: 500px">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-px-sm">Update User</div>
                </q-card-section>
                <div style="max-height: 60vh; overflow-y: auto;">
                <div class="q-pl-md">
                  <div class="row">
                    <div class="col-10 text-center">
                      <template>
                        <img
                          dense
                          :src="user.profileImageURL"
                          style="
                            border-radius: 10000px;
                            height: 100px;
                            width: 100px;
                          "
                          class="q-ml-xl"
                        />
                      </template>
                    </div>
                    <div class="col-5 offset-3" style="max-width: 250px">
                      <q-file
                        max-files="1"
                        counter
                        color="grey-3"
                        accept=".jpg, image/*"
                        outlined
                        dense
                        max-file-size="2500000"
                        v-model="image"
                        label="Select Profile Picture"
                        class="q-pl-xs"
                        @rejected="onRejected"
                      >
                        <template>
                          <q-icon name="attachment" />
                        </template>
                      </q-file>
                    </div>
                  </div>
                </div>
                <div class="q-px-md q-mt-md row">
                  <div class="q-gutter-md col-6" style="max-width: 300px">
                    <q-input
                      outlined
                      dense
                      v-model="user.firstName"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please enter first name',
                      ]"
                      label="First Name"
                    />
                  </div>
                  <div
                    class="q-gutter-md col-6 q-pl-md"
                    style="max-width: 300px"
                  >
                    <q-input
                      outlined
                      dense
                      v-model="user.lastName"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please enter last name',
                      ]"
                      label="Last Name"
                    />
                  </div>
                </div>
                <div class="q-px-md q-mt-md row">
                  <div class="q-gutter-md col-6" style="max-width: 300px">
                    <!-- <q-input
                      outlined
                      dense
                      v-model="date"
                      mask="##/##/####"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please enter last name',
                      ]"
                      label="Date of Join"
                    /> -->
                    <q-input
                      outlined
                      v-model="date"
                      lazy-rules
                      label="Date of Join"
                      dense
                      readonly
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="date" minimal :options="optionsFn" mask="DD/MM/YYYY">
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
                  <div
                    class="q-gutter-md col-6 q-pl-md"
                    style="max-width: 300px"
                  >
                    <q-select
                      outlined
                      dense
                      v-model="user.mentor"
                      use-input
                      input-debounce="0"
                      emit-value
                      map-options
                      :options="filteredUsers"
                      @filter="filterFnUsers"
                      label="Select Mentor"
                      option-value="id"
                      option-label="label"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>
                <div class="q-px-md q-mt-md row">
                  <div class="q-gutter-md col-6" style="max-width: 300px">
                    <q-input
                      outlined
                      dense
                      type="email"
                      v-model="user.emails.genesis"
                      @input="genesisEmailChange"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please enter email',
                        (val) =>
                          /^\w+([\.-]?\w+)*@genesistechnologies\.in$/.test(
                            val
                          ) || 'Please Enter valid Genesis Email',
                      ]"
                      label="Genesis Email"
                    />
                  </div>
                  <div
                    class="q-gutter-md col-6 q-pl-md"
                    style="max-width: 300px"
                  >
                    <q-input
                      outlined
                      dense
                      type="email"
                      v-model="user.emails.google"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please enter email',
                        (val) =>
                          /^\w+([\.-]?\w+)*@gmail\.com$/.test(val) ||
                          'Please Enter valid Google Email',
                      ]"
                      label="Google Email"
                      @input="googleEmailChange"
                    />
                  </div>
                </div>
                <div class="q-px-md q-mt-md row">
                  <div class="q-gutter-md col-6">
                    <q-select
                      ref="editDept"
                      outlined
                      multiple
                      dense
                      v-model="selectDepartment"
                      use-input
                      input-debounce="0"
                      :options="filteredDepartments"
                      @filter="filterFnDepartments"
                      @input="clearFilter"
                      label="Select Departments"
                      emit-value
                      map-options
                      option-value="id"
                      option-label="label"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) ||
                          'Please select atleast one department',
                      ]"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="q-gutter-md col-6 q-pl-md">
                    <q-select
                      outlined
                      dense
                      v-model="userUserType"
                      :options="userTypes"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please select user type',
                      ]"
                      label="select user type"
                    />
                  </div>
                </div>
                </div>

                <div>
                  <q-card-actions class="justify-end">
                    <q-btn
                      color="white"
                      textColor="primary"
                      flat
                      label="cancel"
                      @click="close"
                    />
                    <q-btn type="submit" color="primary" label="Submit" />
                  </q-card-actions>
                </div>
              </q-card>
            </q-form>
          </div>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
import axios from "axios";
import moment from "moment";
import departmentsService from "../../services/departments.service";
import usersService from "../../services/users.service";
import functions from "../../services/functions";
export default {
  data() {
    return {
      pass: "password",
      check: true,
      firstName: "",
      lastName: "",
      users: [],
      filteredUsers: [],
      mentor: "",
      genesisEmail: "",
      googleEmail: "",
      password: "",
      today: new Date(),
      selectDepartment: [],
      filteredDepartments: [],
      departments: [],
      arr: [],
      userTypes: ["User", "Mentor", "Manager", "Admin"],
      msg: [],
      googlemsg: [],
      image: [],
      date: "",
      user: {
        emails: { genesis: null, google: null },
        dates: { dateOfJoin: null },
        userTypes: "",
      },
      imageConverted:
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png",
      blob: "",
    };
  },
  computed: {
    // date: {
    //   get() {
    //     return this.user.dates.dateOfJoin
    //       .substring(0, 10)
    //       .split("-")
    //       .reverse()
    //       .join("/");
    //   },
    //   set(value) {
    //     this.user.dates.dateOfJoin = moment(value).toISOString();
    //   },
    // },
    userUserType: {
      get() {
        if (this.user.userType)
          return (
            this.user.userType.substring(0, 1).toUpperCase() +
            this.user.userType
              .substring(1, this.user.userType.length)
              .toLowerCase()
          );
        else return null;
      },
      set(value) {
        this.user.userType = value.toLowerCase();
        console.log(this.user.userType);
      },
    },
  },
  watch: {
    image: function (newVal) {
      this.user.profileImageURL = URL.createObjectURL(newVal);
      this.blob = new Blob([newVal], { type: "image/png" });
    },
    userId: async function (value) {
      await this.getAllUsers();
      const response = await usersService.fetchUserByID(value);
      this.user = response.data[0];
      this.selectDepartment = [];
      this.user.departments.forEach((department) => {
        this.selectDepartment.push(department._id);
      });
      this.date = this.user.dates.dateOfJoin.substring(0, 10).split("-").reverse().join("/");
    },
  },

  methods: {
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
      return (
        date <= currentDate
      );
    },
    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      let msg = rejectedEntries.length + 'file(s) did not pass validation constraints';
      if(rejectedEntries[0].failedPropValidation == 'max-file-size'){
        msg = 'Please select file less 2.5mb.'
      }
      console.log(rejectedEntries[0].failedPropValidation);
      this.$q.notify({
        type: "negative",
        message: msg,
      });
    },
    clearFilter() {
      if (this.$refs.editDept !== void 0) {
        this.$refs.editDept.updateInputValue("");
      }
    },
    googleEmailChange() {
      if (this.user.emails.google[this.user.emails.google.length - 1] == "@") {
        this.user.emails.google += "gmail.com";
      }
    },
    genesisEmailChange() {
      if (this.user.emails.genesis[this.user.emails.genesis.length - 1] == "@") {
        this.user.emails.genesis += "genesistechnologies.in";
      }
    },
    close() {
      this.image = []
      this.$emit("layoutFalse");
    },
    filterFnDepartments(val, update, abort) {
      update(() => {
        const needle = val.toLocaleLowerCase();
        this.filteredDepartments = this.departments.filter(
          (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterFnUsers(val, update, abort) {
      update(() => {
        const needle = val.toLocaleLowerCase();
        this.filteredUsers = this.users.filter(
          (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
        );
      });
    },
    change() {
      this.check = !this.check;
      this.pass = this.check ? "password" : "text";
    },
    async onSubmit() {
      this.user.departments = [];
      let dojdate = this.date.split('/')[1] + '/' + this.date.split('/')[0]  + '/' + this.date.split('/')[2];
      let date_ = new Date(dojdate);
      let setdate = date_.setDate(date_.getDate() + 1);
      this.user.dates.dateOfJoin = new Date(setdate).toISOString();
      this.selectDepartment.forEach((department) => {
        this.user.departments.push(department);
      });
      const res = await usersService.updateUserByID(this.userId, this.user, {
        file: this.blob,
      });
      this.close();
    },
    async getAllDepartment() {
      const response = await departmentsService.fetchAllDepartment();
      this.departments = [];
      response.data.forEach((data) => {
        this.departments.push({
          id: data._id,
          label: data.name,
        });
      });
      this.filteredDepartments = this.departments;
    },

    async getAllUsers() {
      this.users = [];
      const response = await usersService.fetchUsers();
      response.data.forEach((user) => {
        console.log(user._id == this.userId);
        // if (this.userId !== user._id && user.userType != "user")
          this.users.push({
            id: user._id,
            label: user.firstName + " " + user.lastName,
          });
      });
      this.filteredUsers = this.users;
    },
  },
  async mounted() {
    await this.getAllDepartment();
    await this.getAllUsers();
  },
  props: ["layout", "userId"],
};
</script>