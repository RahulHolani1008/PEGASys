<template>
  <div>
    <div>
      <div
        class="q-px-md q-mt-md q-ml-lg q-gutter-sm"
        style="position: relative"
      >
        <q-btn label="Add New User" color="primary" @click="layout = true" />

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
                  <div class="text-h6 q-px-sm">Add New User</div>
                </q-card-section>
                <div style="max-height: 60vh; overflow-y: auto;">
                <div class="q-pl-md">
                  <div class="row">
                    <div class="col-10 text-center">
                      <template>
                        <img
                          dense
                          :src="imageConverted"
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
                      v-model="firstName"
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
                      v-model="lastName"
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
                    <q-input
                      outlined
                      dense
                      :type="pass"
                      v-model="password"
                      lazy-rules
                      autocomplete="new-password"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please enter password',
                      ]"
                      label="Password"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="check ? 'visibility_off' : 'visibility'"
                          @click="change()"
                          class="cursor-pointer"
                        />
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
                      v-model="mentor"
                      use-input
                      input-debounce="0"
                      emit-value
                      map-options
                      :options="filteredUsers"
                      @filter="filterFnUsers"
                      label="Select Mentor"
                      option-value="id"
                      option-label="label"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) ||
                          'Please select a Mentor',
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
                </div>
                <div class="q-px-md q-mt-md row">
                  <div class="q-gutter-md col-6" style="max-width: 300px">
                    <q-input
                      outlined
                      dense
                      type="email"
                      v-model="genesisEmail"
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
                      v-model="googleEmail"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please enter email',
                        (val) =>
                          /^\w+([\.-]?\w+)*@gmail\.com$/.test(val) ||
                          'Please Enter valid Google Email',
                      ]"
                      @input="googleEmailChange"
                      label="Google Email"
                    />
                  </div>
                </div>
                <div class="q-px-md q-mt-md row">
                  <div class="q-gutter-md col-6">
                    <q-select
                      ref="dept"
                      outlined
                      multiple
                      dense
                      v-model="selectDepartment"
                      use-input
                      input-debounce="0"
                      :options="filteredDepartments"
                      @filter="filterFnDepartments"
                      label="Select Departments"
                      emit-value
                      map-options
                      @input="clearFilter"
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
                      v-model="selectedUserType"
                      :options="userTypes"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please select user type',
                      ]"
                      label="Select User Type"
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
          <q-dialog
            v-model="errorLayout"
            persistent
            transition-show="scale"
            transition-hide="scale"
          >
            <q-card class="bg-negative text-white login-error">
              <q-card-section>
                <div class="text-h6">
                  <q-icon
                    name="warning"
                    class="text-white"
                    style="font-size: 2rem"
                  />
                  User Already Exists
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                User by this email already exists. Please try with another
                email.
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn
                  flat
                  color="negative"
                  label="OK"
                  @click="errorLayout = false"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
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
      layout: false,
      check: true,
      firstName: "",
      lastName: "",
      users: [],
      filteredUsers: [],
      mentor: "",
      genesisEmail: "",
      googleEmail: "",
      password: "",
      selectedUserType: null,
      selectDepartment: [],
      filteredDepartments: [],
      errorLayout: false,
      departments: [],
      arr: [],
      userTypes: ["User", "Mentor", "Manager", "Admin"],
      msg: [],
      googlemsg: [],
      image: [],
      imageConverted:
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png",
      blob: "",
    };
  },
  watch: {
    image: function (newVal) {
      this.imageConverted = URL.createObjectURL(newVal);
      this.blob = new Blob([newVal], { type: "image/png" });
    },
  },
  methods: {
    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      let msg = rejectedEntries.length + 'file(s) did not pass validation constraints';
      if(rejectedEntries[0].failedPropValidation == 'max-file-size'){
        msg = 'Please select file less then 2.5 MB.'
      }
      this.$q.notify({
        type: "negative",
        message: msg,
      });
    },
    clearFilter() {
      if (this.$refs.dept !== void 0) {
        this.$refs.dept.updateInputValue("");
      }
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
    googleEmailChange() {
      if (this.googleEmail[this.googleEmail.length - 1] == "@") {
        this.googleEmail += "gmail.com";
      }
    },
    genesisEmailChange() {
      if (this.genesisEmail[this.genesisEmail.length - 1] == "@") {
        this.genesisEmail += "genesistechnologies.in";
      }
    },
    close() {
      this.pass = "password";
      this.layout = false;
      this.check = true;
      this.firstName = "";
      this.lastName = "";
      this.mentor = "";
      this.genesisEmail = "";
      this.googleEmail = "";
      this.password = "";
      this.selectedUserType = null;
      this.selectDepartment = [];
      this.arr = [];
      this.userTypes = ["User", "Mentor", "Manager", "Admin"];
      this.msg = [];
      this.googlemsg = [];
      this.image = [];
      this.imageConverted =
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
      this.blob = "";
    },
    change() {
      this.check = !this.check;
      this.pass = this.check ? "password" : "text";
    },
    async onSubmit() {
      try {
        const res = await usersService.addNewUser(
          {
            departments: this.selectDepartment,
            deleted: false,
            userType: this.selectedUserType.toLowerCase(),
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            emails: {
              google: this.googleEmail,
              genesis: this.genesisEmail,
            },
            profileImageURL: this.imageConverted,
            mentor: this.mentor,
            description: "",
            URLs: {
              linkedIn: null,
              facebook: null,
              upwork: null,
              github: null,
              skype: null,
            },
          },
          { file: this.blob }
        );
        this.$emit("submit");
        this.close();
        this.layout = false;
      } catch (e) {
        this.errorLayout = true;
      }
    },
    async getAllDepartment() {
      const response = await departmentsService.fetchAllDepartment();
      this.departments = [];
      response.data.forEach((department) => {
        this.departments.push({
          id: department._id,
          label: department.name,
        });
      });
      this.filteredDepartments = this.departments;
    },

    async getAllUsers() {
      this.users = [];
      const response = await usersService.fetchUsers();
      response.data.forEach((user) => {
        if (user.userType != "user")
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
};
</script>
