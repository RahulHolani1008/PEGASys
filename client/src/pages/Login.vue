<template>
  <div>
    <q-card class="my-card absolute-center" style="min-width: 300px !important">
      <div class="q-ml-sm">
        <q-card-section>
          <div class="text-center">
            <img
              src="https://genesistechnologies.in/wp-content/uploads/2019/03/cropped-G_Logo-2.png"
              alt=""
              class=""
              style="width: 182px; height: 60px"
            />
          </div>
        </q-card-section>

        <q-form @submit="onSubmit">
          <q-card-actions vertical>
            <div class="q-my-sm q-pa-md">
              <div>
                <div id="emailvalue">
                  <q-input
                    type="email"
                    v-model="email"
                    outlined
                    lazy-rules
                    :rules="[
                      (val) => (val && val.length > 0) || 'Please enter email',
                      (val) =>
                        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                          val
                        ) || 'Invalid Email',
                    ]"
                    label="Enter Email"
                    @input="loginEmail"
                  />
                </div>
                <q-input
                  v-model="pass"
                  :type="password"
                  lazy-rules
                  outlined
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please enter password',
                  ]"
                  label="Enter Password"
                >
                  <template v-slot:append>
                    <q-icon
                      v-if="check"
                      name="visibility_off"
                      @click="change()"
                      class="cursor-pointer"
                    />
                    <q-icon
                      v-if="!check"
                      name="visibility"
                      @click="change()"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="text-center">
              <q-btn
                type="submit"
                class="q-my-md loginbtn"
                size="md"
                label="Login"
                color="primary"
              />
            </div>
          </q-card-actions>
        </q-form>
      </div>
    </q-card>

    <div>
      <q-dialog
        v-model="errorModal"
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
              {{ errorTitle }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ errorMsg }}
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn
              flat
              color="negative"
              label="OK"
              @click="errorModal = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import usersService from "../Users../../services/users.service";
import axios from "axios";
import loginService from "../services/login.service";

import functions from "../services/functions";
export default {
  name: "Profile",
  data() {
    return {
      errorModal: false,
      email: "",
      msg: [],
      pass: "",
      password: "password",
      check: true,
      errorTitle: "",
      errorMsg: "",
      internetConn: navigator.onLine,
    };
  },
  methods: {
    loginEmail() {
      if (this.email[this.email.length - 1] == "@") {
        this.email += "genesistechnologies.in";
      }
    },
    async onSubmit() {
      try {
        if (this.internetConn) {
          const response = await loginService.login({
            email: this.email,
            password: this.pass,
          });

          if (
            response.data === "Invalid password" ||
            response.data === "Invalid email" ||
            response.data === "Invalid Email or Password"
          ) {
            this.prepareLoginError("Oops", response.data);
          } else {
            var result = response.data;
            this.storeData(result);
            this.$store.commit("setToken", result.token);
            window.location.href = "/";
          }
        } else {
          this.prepareLoginError(
            "No internet",
            "Please check your internet connection and try again"
          );
          var intervalId = setInterval(() => {
            if (navigator.onLine) {
              this.internetConn = navigator.onLine;
              this.errorModal = false;
              clearInterval(intervalId);
            }
          }, 1000);
        }
      } catch (e) {
        this.prepareLoginError(
          "System Error",
          "Error in login, Please get in contact with the system Administrator."
        );
      }
    },
    prepareLoginError(title, msg) {
      this.errorModal = true;
      this.errorTitle = title;
      this.errorMsg = msg;
    },

    // async getAllMentees(userId){
    //   const mentees=await usersService.getMyMentees(userId)
    //   this.$store.commit("setMentees", mentees)
    // },

    storeData(result) {
      this.$store.commit("setUser", result.user);
      this.$store.commit("setToken", result.token);
    },
    change() {
      this.check = !this.check;
      this.password = this.check ? "password" : "text";
    },
  },
};
</script>
<style lang="css" scoped>
.my-card {
  /* margin-left: 350px; */
  /* margin-top: 150px; */
  width: 100%;
  max-width: 35vw;
  height: fit-content;
  /* min-height: 55%; */
}
.loginbtn {
  /* width: 200px; */
  width: 120px;
  height: 35px;
}
.login-error {
  height: fit-content;
  max-height: 50vh;
  width: 100%;
  max-width: 500px;
}
</style>
