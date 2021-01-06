<template>
  <div>
    <div class="row q-py-sm">
      <div>
        <!-- Add Project Model -->
        <q-dialog v-model="addSkill" persistent>
          <q-card class="addProjectDailog">
            <q-card-section>
              <div class="text-h6 q-px-sm">Add Skills Raiting</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form @submit="onSubmit">
                <div class="row q-mb-sm">
                  <div class="col-12 q-px-sm">
                    <q-select
                      outlined
                      multiple
                      v-model="skill"
                      :options="optionSkills"
                      label="Select Skills"
                      dense
                      use-input
                      use-chips
                      input-debounce="0"
                      @filter="filterSkill"
                    />
                  </div>
                </div>
                <div class="row q-mb-sm">
                  <div class="col-12 q-px-sm">
                    <q-table
                      class="my-sticky-virtscroll-table add-Lead q-mb-sm overflow-hidden"
                      :data="userSkills"
                      :columns="usersBySkillColumns"
                      row-key="name"
                      no-data-label="No Skills are Added."
                      hide-bottom
                      hide-top
                      virtual-scroll
                      :hide-pagination="true"
                      :rows-per-page-options="[0]"
                    >
                      <template v-slot:body="props">
                        <q-tr :props="props">
                          <q-td key="name" :props="props">
                            {{ props.row.name }}
                          </q-td>

                          <q-td key="rate" :props="props">
                            <q-rating
                              v-model="props.row.rate"
                              size="2em"
                              :max="10"
                              color="grey"
                              icon="star_border"
                              icon-selected="star"
                              no-dimming
                              :color-selected="ratingColors"
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
                                <q-tooltip
                                  >5 Can do the assigned work</q-tooltip
                                >
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
                          </q-td>
                          <q-td key="lead" :props="props">
                            <q-icon
                              class="float-right cursor-pointer"
                              color="red"
                              size="sm"
                              name="clear"
                              @click="remove(props.row.id)"
                            ></q-icon>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </div>
                </div>
                <q-card-actions align="right" class="q-px-md">
                  <q-btn flat label="Close" color="primary" @click="resetAll" />
                  <q-btn
                    v-if="userSkills.length > 0"
                    type="submit"
                    color="primary"
                    label="Add Skill"
                  />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
        <q-dialog
          v-model="confirmReject"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <q-card class="bg-negative text-white reject-timesheet">
            <q-card-section>
              <div class="text-h6">Confirm</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              Are you sure, You want to Remove this skill?
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn
                icon-right="o_cancel"
                color="negative"
                class="fs--14"
                flat
                label="Remove"
                @click="confirmRemove()"
              ></q-btn>
              <q-btn
                flat
                color="primary"
                label="Close"
                @click="confirmReject = false"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import usersService from "../../services/users.service";
import skillsService from "../../services/skills.service";
import skillRatingsService from "../../services/skillRatings.service";
import functions from "../../services/functions";

export default {
  name: "FilterTeams",
  components: {},
  created() {
    this.getAllSkills();
  },
  watch: {
    skill: {
      handler: function (newValue, oldValue) {
        // console.log(newValue);
        // console.log(oldValue);
        if (oldValue != null) {
          if (newValue.length > oldValue.length) {
            var lastIndexObject = newValue[newValue.length - 1];
            this.userSkills.push({
              id: lastIndexObject.value,
              name: lastIndexObject.label,
              rate: 0,
            });
          }
          if (newValue.length < oldValue.length) {
            let notIncludeindex;
            oldValue.forEach((skill, index) => {
              if (!newValue.includes(skill)) {
                notIncludeindex = index;
              }
            });

            this.userSkills.splice(notIncludeindex, 1);
          }
        } else {
          this.userSkills = [];

          this.userSkills.push({
            id: newValue[0].value,
            name: newValue[0].label,
            rate: 0,
          });
        }
      },
      deep: true,
    },
    userRating: function (newValue) {
      // console.log(newValue);
      this.setUserSkill(newValue);

      // console.log(this.skill);
    },
  },
  props: ["addSkill", "userRating"],
  data() {
    return {
      skillId: "",
      confirmReject: false,
      userHaveSkills: [],
      setDataForEdit: null,
      skill: [],
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
      user: null,
      usersBySkillColumns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: "rate",
          align: "center",
          label: "Rating",
          field: "rate",
          sortable: true,
        },
        { name: "lead", align: "left", label: "", field: "" },
      ],

      userSkills: [
        /* this.usersBySkill */
      ],
      skillOptions: [
        // {
        //   label: ".Net",
        //   value: ".Net",
        // }
      ],
      optionSkills: [
        /* skillOptions */
      ],
    };
  },
  methods: {
    confirmRemove() {
      this.removeSkill();
      this.confirmReject = false;
    },
    async removeSkill() {
      let index;
      this.skill.forEach((skill, idx) => {
        if (skill.value == this.skillId) {
          index = idx;
        }
      });
      this.skill.splice(index, 1);
      this.removeUserSkill();
      await this.deleteSkill(this.skillId);
    },
    setUserSkill(newValue) {
      //alert("hello");
      newValue.forEach((val) => {
        var obj = {
          label: val.skill.name,
          value: val.skill._id,
        };
        this.skill.push(obj);
        this.userSkills.push({
          id: val.skill._id,
          name: val.skill.name,
          rate: val.rating,
        });
      });
    },
    async remove(skillId) {
      this.confirmReject = true;
      this.skillId = skillId;
    },
    removeUserSkill() {
      let idx;
      this.userSkills.forEach((removeSkill, index) => {
        if (removeSkill.id == this.skillId) {
          idx = index;
        }
      });
      this.userSkills.splice(idx, 1);
    },
    async deleteSkill(id) {
      let requestData = {
        to: this.$store.getters.userId,
        skill: id,
      };
      const response = await skillRatingsService.deleteSkill(requestData);
    },
    async getAllSkills() {
      this.skillOptions = [];
      const response = await skillsService.fetchAllSkills();
      response.data.forEach((skill) => {
        this.skillOptions.push({
          label: skill.name,
          value: skill._id,
        });
      });
      this.optionSkills = this.skillOptions;
    },
    filterSkill(val, update) {
      if (val === "") {
        update(() => {
          this.optionSkills = this.skillOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionSkills = [];
        this.skillOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionSkills.push(option);
          }
        });
      });
    },
    async onSubmit(event) {
      let requestData = [];

      this.userSkills.forEach((skill) => {
        requestData.push({
          to: this.$store.getters.userId,
          from: this.$store.getters.userId,
          rating: skill.rate,
          role: "self",
          skill: skill.id,
        });
      });
      const response = await skillRatingsService.addSkillsRating(requestData);
      // console.log("AddProjectData: " + JSON.stringify(requestData));
      this.resetAll();
    },
    resetAll() {
      this.$emit("layoutClose");
      this.userSkills = [];
      this.skill = [];
    },
  },
};
</script>

<style>
.addProjectDailog {
  width: 100% !important;
  max-width: 700px !important;
  height: auto;
}

.add-Lead {
  width: 100%;
  height: 250px;
}
/*  Client Name Table */
.my-sticky-virtscroll-table {
  /* height or max-height is important */
  border: 1px solid #777777;
  border-radius: 20px;
  box-shadow: none;
}
.q-table__top,
.q-table__bottom,
thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #fff;
}
thead tr th {
  position: sticky;
  z-index: 1;
}
/* this will be the loading indicator */
thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}
thead tr:first-child th {
  top: 0;
}
</style>