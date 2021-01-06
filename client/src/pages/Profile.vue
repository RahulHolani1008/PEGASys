<template>
  <div class="q-px-md q-pt-md">
    <div class="q-col-gutter-md row items-start">
      <div class="col-6">
        <div class="row">
          <q-img
            :src="
              user.profileImageURL == null ? defaultImg : user.profileImageURL
            "
            style="width: 150px; height: 150px; border-radius: 100%"
            class="col-4"
          >
          </q-img>
          <div class="col-8 q-mt-lg q-pl-md">
            <div class="fs--36">{{ user.firstName }} {{ user.lastName }}</div>
            <div>
              <span v-for="(department, index) in user.departments" :key="index"
                >{{ department.name
                }}<span v-if="index != user.departments.length - 1">, </span>
              </span>
            </div>
            <div class="fs--12">
              Member since
              {{ dateOfJoin }}
            </div>
            <div>
              <span class="fs--12 q-mt-sm" v-if="!editingMode"
                >🎂 {{ birthDate }}</span
              >
              <q-input
                outlined
                lazy-rules
                v-if="editingMode"
                style="min-width: 325px"
                label="Birthdate"
                v-model="birthDayDate"
                mask="date"
                prefix="🎂"
                dense
                clearable
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="birthDayDate" minimal>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="DONE"
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
        <div
          v-for="(link, index) in links"
          :key="index"
          class="fit row wrap justify-start items-start content-start full-width q-pt-md"
          v-show="editingMode || (link.link != null && link.link != '')"
        >
          <q-img
            :src="link.logo"
            style="width: 20px; height: 20px"
            class="q-mt-sm"
          >
          </q-img>
          <span class="q-pl-lg q-mt-sm" v-if="!editingMode">{{
            link.link
          }}</span>
          <q-input
            outlined
            lazy-rules
            v-if="editingMode"
            style="min-width: 325px"
            :label="link.name"
            v-model="link.link"
            @input="getUserLinks(link.link, link.name)"
            class="q-pl-lg"
            dense
          />
        </div>
        <div class="q-pt-lg" style="display: inline-flex; margin-left: -5px">
          <q-icon size="xl" name="mail_outline"></q-icon>
          <ul style="list-style-type: none" class="q-mt-none q-pl-none">
            <li class="q-pl-xl" style="margin-left: -45px" v-if="!editingMode">
              {{ user.emails.genesis }}
            </li>
            <li class="q-pl-xl" style="margin-left: -45px" v-if="!editingMode">
              {{ user.emails.google }}
            </li>
            <li
              class="q-pl-lg"
              style="display: inline-block"
            >
              <q-input
                v-if="editingMode"
                outlined
                readonly
                label="Genesis mail"
                lazy-rules
                v-model="user.emails.genesis"
                dense
              ></q-input>
            </li>
            <li
              class="q-mt-sm"
              style="margin-left: 10px; display: inline-block"
            >
              <q-input
                v-if="editingMode"
                outlined
                lazy-rules
                readonly
                label="Gmail"
                v-model="user.emails.google"
                dense
              ></q-input>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-6">
        <div
          style="height: 160px; width: 600px; overflow-y: auto"
          v-if="!editingMode"
          v-html="user.description"
        ></div>
        <div style="height: max-content; width: 600px" v-if="editingMode">
          <q-editor
            v-model="user.description"
            :dense="$q.screen.lt.lg"
            :toolbar="[
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify'],
                },
              ],
              [
                'bold',
                'italic',
                'strike',
                'underline',
                'subscript',
                'superscript',
              ],
              ['token', 'hr', 'link', 'custom_btn'],

              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                },
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
          />
        </div>
        <div v-if="$store.getters.isAuthenticated">
          <div class="text-center q-mr-xl q-mt-md">
            <span class="text-weight-bold q-mr-md">Your Ratings</span>
          </div>
          <q-list
            class="overflow-auto q-ml-sm"
            style="
              border-radius: 6%;
              border: 2px solid black;
              width: 550px;
              height: 220px;
              text-align: center;
            "
          >
            <div v-if="ratings.length > 0">
              <div v-for="skillRate in ratings" :key="skillRate.id">
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label lines="1" class="text-subtitle2">{{
                      skillRate.skill.name
                    }}</q-item-label>
                    <div>
                      <q-rating
                        v-model="skillRate.rating"
                        size="2em"
                        :max="10"
                        color="grey"
                        icon="star_border"
                        icon-selected="star"
                        no-dimming
                        :color-selected="ratingColors"
                        @input="rateSkill(skillRate.id, skillRate.rating)"
                      >
                        <template v-slot:tip-1>
                          <q-tooltip>1 New to technology</q-tooltip>
                        </template>
                        <template v-slot:tip-2>
                          <q-tooltip>2</q-tooltip>
                        </template>
                        <template v-slot:tip-3>
                          <q-tooltip>3</q-tooltip>
                        </template>
                        <template v-slot:tip-4>
                          <q-tooltip>4</q-tooltip>
                        </template>
                        <template v-slot:tip-5>
                          <q-tooltip>5 Can do the assigned work</q-tooltip>
                        </template>
                        <template v-slot:tip-6>
                          <q-tooltip>6</q-tooltip>
                        </template>
                        <template v-slot:tip-7>
                          <q-tooltip>7</q-tooltip>
                        </template>
                        <template v-slot:tip-8>
                          <q-tooltip>8</q-tooltip>
                        </template>
                        <template v-slot:tip-9>
                          <q-tooltip>9</q-tooltip>
                        </template>
                        <template v-slot:tip-10>
                          <q-tooltip>10 He/She wil get it done</q-tooltip>
                        </template>
                      </q-rating>
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator inset />
              </div>
            </div>
            <div v-else>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label lines="1" class="text-subtitle3 text-italic">
                    No Skills are Added.
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <q-item v-if="editingMode">
              <q-item-section>
                <q-btn
                  label="Add your skill"
                  color="primary"
                  @click="addSkill = true"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-btn
          label="Edit Profile"
          class="float-right q-mt-md"
          v-if="!editingMode && isCurrentUser()"
          color="primary"
          @click="editingMode = true"
        />
        <q-btn
          class="float-right q-mt-md"
          label="Save Profile"
          color="primary"
          v-if="editingMode"
          @click="saveProfile"
        />
      </div>
    </div>
    <AddSkills
      :addSkill="addSkill"
      @layoutClose="closeModel"
      :userRating="ratings"
    />
  </div>
</template>
<script>
import AddSkills from "../components/Profile/AddSkills";
import UserService from "../services/users.service";
import SkillRating from "../services/skillRatings.service";
import functions from "../services/functions";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "Profile",
  components: {
    AddSkills,
  },
  data() {
    return {
      addSkill: false,
      user: {
        dates: { dateOfJoin: null, birthDate: null },
        emails: { genesis: null, gmail: null },
      },
      birthDayDate: "",
      editingMode: false,
      links: [],
      defaultImg:
        "https://www.pngitem.com/pimgs/m/516-5167304_transparent-background-white-user-icon-png-png-download.png",
      ratingModel: 3,
      ratings: [],
      //skills: ["JavaScript", "NodeJs", "VueJs", "ExpressJs"],
      skills: [],
      ratingColors: [
        "primary",
        "secondary",
        "primary",
        "secondary",
        "primary",
        "secondary",
        "primary",
        "secondary",
        "primary",
        "secondary",
      ],
    };
  },
  watch: {
    birthDayDate: function (newValue) {
      this.user.dates.birthDate = new Date(newValue).toISOString();
    },
  },
  computed: {
    dateOfJoin: {
      get() {
        return this.user.dates.dateOfJoin
          ? functions.convertDateToDate(this.user.dates.dateOfJoin)
          : null;
      },
    },
    birthDate: {
      get() {
        return functions.convertDateToDate(this.user.dates.birthDate);
      },
      set(value) {
        this.user.dates.birthDate = functions.convertDateToDateReverse(value);
      },
    },
  },
  methods: {
    isCurrentUser() {
      if (this.$route.path.split("/")[2] == this.$store.getters.userId)
        return true;
      else return false;
    },
    getUserLinks(value, linkName) {
      this.links.forEach((link) => {
        switch (linkName) {
          case link.name:
            link.link = value;
            break;
          case link.name:
            link.link = value;
            break;
          case link.name:
            link.link = value;
            break;
          case link.name:
            link.link = value;
            break;
          case link.name:
            link.link = value;
            break;
        }
      });
    },
    closeModel() {
      this.addSkill = false;
      this.rateSkill();
    },
    getUser() {
      return this.$route.path.split("/")[2];
    },
    async saveProfile() {
      this.user.URLs = {
        facebook: this.links.filter((link) => {
          return link.name == "facebook";
        })[0].link,
        skype: this.links.filter((link) => {
          return link.name == "skype";
        })[0].link,
        linkedIn: this.links.filter((link) => {
          return link.name == "linkedIn";
        })[0].link,
        upwork: this.links.filter((link) => {
          return link.name == "upwork";
        })[0].link,
        github: this.links.filter((link) => {
          return link.name == "github";
        })[0].link,
      };
      let data = await UserService.updateUserByIDNoForm(
        this.$store.getters.userId,
        this.user
      ).data;
      this.editingMode = false;
    },
    async rateSkill() {
      const skillResponse = await SkillRating.fetchRatingsGivenByUserToUser(
        this.getUser(),
        this.$store.getters.userId
      );
      this.ratings = skillResponse.data;
      // console.log(skillResponse.data);
    },
    async getUserById() {
      const response = await UserService.fetchUserByID(this.getUser());
      this.user = response.data[0];
      if (
        this.user.dates.birthDate != null &&
        this.user.dates.birthDate != ""
      ) {
        this.birthDayDate = functions.convertDateInCalenderFormat(
          this.user.dates.birthDate
        );
      }
      this.links = [];
      // console.log(this.user);
      Object.values(response.data[0].URLs).forEach((url, index) => {
        let logo = "";

        switch (Object.keys(response.data[0].URLs)[index]) {
          case "linkedIn":
            logo =
              "data:image/jpeg;base64,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";
            break;
          case "facebook":
            logo =
              "data:image/jpeg;base64,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";
            break;
          case "skype":
            logo =
              "data:image/jpeg;base64,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";
            break;
          case "upwork":
            logo =
              "data:image/png;base64,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";
            break;
          case "github":
            logo =
              "data:image/png;base64,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";
            break;
        }

        this.links.push({
          link: url,
          name: Object.keys(response.data[0].URLs)[index],
          logo: logo,
        });
      });
      // console.log(this.links);
    },
  },
  mounted() {
    this.getUser();
    this.getUserById();
    this.rateSkill();
  },
};
</script>''