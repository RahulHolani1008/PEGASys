<template>
  <div>
    <div>
      <div class="q-pa-md q-gutter-sm" style="position: relative">
        <q-btn
          label="Add Announcement"
          color="primary"
          style="position: fixed; left: 40px; bottom: 10px"
          @click="layout = true"
        />

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
                      <label>Title</label>
                    </div>
                    <div class="q-gutter-md col-8" style="max-width: 300px">
                      <q-input
                        outlined
                        v-model="title"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter announcement title',
                        ]"
                        label="Title"
                      />
                    </div>
                  </div>
                </div>

                <div class="q-pt-sm q-pl-md">
                  <div class="q-pa-md row">
                    <div class="col-4 text-right q-pt-md q-pr-lg fs--18">
                      <label>Announcement Descriptions</label>
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
import axios from "axios";
import moment from "moment";
import functions from "../services/functions";
export default {
  name: "AddAnnouncement",

  data() {
    return {
      layout: false,
      model: null,
      title: "",
      moreContent: true,
      drawer: false,
      drawerR: false,

      persistent: false,

      description: "",
    };
  },
  methods: {
    onSubmit() {
      //   axios
      //     .post("http://localhost:8081/announcements/addAnnouncement", {
      //       title: this.title,
      //       description: this.description,
      //       postedBy: this.postedBy,
      //       date: this.date,
      //     })
      //     .then(
      //       (response) => {
      //         var result = response.data;
      //         console.log(result);
      //         this.$emit("submit");
      //         this.layout = false;
      //       },
      //       (error) => {
      //         console.log(error);
      //       }
      //     );
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