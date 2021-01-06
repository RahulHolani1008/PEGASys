<template>
  <div>
    <div>
      <div class="q-pa-md q-ml-lg q-gutter-sm" style="position: relative">
        <q-btn label="Add Events" color="primary" @click="layout = true" />

        <q-dialog
          v-model="layout"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <div>
            <q-form @submit="onSubmit" action="./events">
              <q-card style="width: 500px">
                <div class="q-pt-sm q-pl-md">
                  <div class="q-pa-md row">
                    <div class="col-4 text-right q-pt-md q-pr-lg fs--18">
                      <label>Event Name</label>
                    </div>
                    <div class="q-gutter-md col-8" style="max-width: 300px">
                      <q-input
                        outlined
                        v-model="title"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter event name',
                        ]"
                        label="Event Name"
                      />
                    </div>
                  </div>
                </div>

                <div class="q-pt-sm q-pl-md">
                  <div class="row">
                    <div class="col-4">
                      <template>
                        <img
                          :src="imageConverted"
                          style="
                            border-radius: 10000px;
                            height: 100px;
                            width: 100px;
                            margin-top: -20px;
                          "
                          class="q-ml-xl"
                        />
                      </template>
                    </div>
                    <div class="q-gutter-md col-8" style="max-width: 290px">
                      <q-file
                        color="grey-3"
                        outlined
                        v-model="image"
                        label="Select Image"
                        class="q-ml-md q-pl-xs"
                      >
                        <template>
                          <q-icon name="attachment" />
                        </template>
                      </q-file>
                    </div>
                  </div>
                </div>
                <div class="q-pt-sm q-pl-md">
                  <div class="q-px-md row">
                    <div class="col-4 text-right q-pt-md q-pr-lg fs--18">
                      <label>Event Date</label>
                    </div>
                    <div class="q-gutter-md col-8" style="max-width: 300px">
                      <q-input outlined v-model="dateDisplay" lazy-rules>
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date v-model="date" :options="optionsFn">
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
                </div>

                <div class="q-pt-sm q-pl-md">
                  <div class="q-pa-md row">
                    <div class="col-4 text-right q-pt-md q-pr-lg fs--18">
                      <label>Event Descriptions</label>
                    </div>
                    <div class="q-gutter-md col-8" style="max-width: 300px">
                      <q-editor
                        v-model="description"
                        :dense="$q.screen.lt.lg"
                        :toolbar="[
                          ['bold', 'italic', 'underline'],
                          ['token', 'hr', 'custom_btn'],

                          [
                            {
                              icon: $q.iconSet.editor.fontSize,
                              fixedLabel: true,
                              fixedIcon: true,
                              list: 'no-icons',
                              options: [
                                'size-1',
                                'size-2',
                                'size-3',
                                'size-4',
                                'size-5',
                                'size-6',
                                'size-7',
                              ],
                            },
                          ],
                        ]"
                        :fonts="{
                          arial: 'Arial',
                          arial_black: 'Arial Black',
                          comic_sans: 'Comic Sans MS',
                          courier_new: 'Courier New',
                          impact: 'Impact',
                          lucida_grande: 'Lucida Grande',
                          times_new_roman: 'Times New Roman',
                        }"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter event name',
                        ]"
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
                      v-close-popup
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
import functions from "../services/functions";
export default {
  watch: {
    image: function (newVal) {
      this.imageConverted = URL.createObjectURL(newVal);
    },
    date: function (value) {
      this.dateDisplay = value.split("/").reverse().join("/");
    },
  },
  created() {
    this.date = moment(new Date()).format("YYYY/MM/DD");
  },
  data() {
    return {
      layout: false,
      model: null,
      title: "",
      moreContent: true,
      drawer: false,
      drawerR: false,
      date: null,
      dateDisplay: Date(),
      persistent: false,
      image: [],
      imageConverted:
        "https://images.emojiterra.com/google/android-oreo/512px/1f389.png",
      description: "",
    };
  },
  methods: {
    onSubmit() {
      axios
        .post("http://localhost:8081/events/addEvent", {
          title: this.title,
          description: this.description,
          postedBy: this.$store.getters.userId,
          pictures: [this.imageConverted],
          date: this.date,
        })
        .then(
          (response) => {
            var result = response.data;
            // console.log(result);
            this.$emit("submit");
            this.layout = false;
          },
          (error) => {
            console.log(error);
          }
        );
    },
    optionsFn(date) {
      return (
        date >=
        new Date().getFullYear() +
          "/" +
          (parseInt(new Date().getMonth().toString()) + 1) +
          "/" +
          new Date().getDate()
      );
    },
  },

  computed: {
    contentSize() {
      return this.moreContent ? 150 : 5;
    },

    // dateDisplay() {
    //   return this.date.split("/").reverse().join("/");
    // },
  },
  mounted() {
    // console.log(this.$store.getters.userId);
    // console.log("Neeraj");
  },
};
</script>