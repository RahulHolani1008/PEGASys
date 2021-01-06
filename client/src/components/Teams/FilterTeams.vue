<template>
  <div>
    <div class="row q-py-sm">
      <div class="col-md-3 col-sm-3 col-xs-7">
        <q-input
          outlined
          v-model="projectFilter"
          class="q-ma-sm bg-white"
          label="Search by Project"
          lazy-rules
          clearable
          dense
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer"> </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-md-9 col-sm-9 col-xs-5 q-pt-sm">
        <q-btn
          class="btn-md float-right"
          @click="addProject = true"
          color="primary"
          align="right"
          label="Add Project"
        />

        <!-- Add Project Model -->
        <q-dialog v-model="addProject">
          <q-card class="addProjectDailog">
            <q-card-section>
              <div class="text-h6 q-px-sm">
                {{ setDataForEdit != null ? "Edit Project" : "Add Project" }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form ref="addProjectref" @submit.prevent="onSubmit">
                <div class="row q-mb-sm">
                  <div class="col-6 q-px-sm">
                    <q-select
                      new-value-mode="add-unique"
                      dense
                      outlined
                      v-model="client"
                      :options="optionClients"
                      label="Client"
                      use-input
                      use-chips
                      input-debounce="0"
                      @new-value="createValue"
                      @filter="filterFn"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-italic text-grey">
                            No clients available
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-6 q-px-sm">
                    <q-input
                      dense
                      outlined
                      v-model="project"
                      label="Project"
                      clearable
                    />
                  </div>
                </div>
                <div class="row q-mb-sm">
                  <div class="col-6 q-px-sm">
                    <q-select
                      outlined
                      v-model="user"
                      :options="optionUsers"
                      label="Person Of Contact"
                      dense
                      use-input
                      use-chips
                      input-debounce="0"
                      @filter="filterUser"
                    />
                  </div>
                  <div class="col-6 q-px-sm">
                    <q-select
                      outlined
                      v-model="lead"
                      :options="optionLeads"
                      label="Lead"
                      dense
                      use-input
                      use-chips
                      input-debounce="0"
                      @filter="filterLead"
                    />
                  </div>
                </div>
                <div class="row q-mb-sm">
                  <div class="col-6 q-px-sm">
                    <q-select
                      outlined
                      v-model="skill"
                      :options="optionSkills"
                      label="Search User By Skill"
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
                      :data="userFromSkill"
                      :columns="usersBySkillColumns"
                      row-key="name"
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
                          <q-td key="skill" :props="props">
                            {{ props.row.skill }}
                          </q-td>
                          <q-td key="rate" :props="props">
                            <!-- {{ props.row.rate }} -->
                            <q-rating
                              v-model="props.row.rate"
                              size="1.6em"
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
                            <q-btn
                              class="float-right"
                              size="sm"
                              color="secondary"
                              @click="
                                getLeadValue(props.row.id, props.row.name)
                              "
                              label="Make Lead"
                            />
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </div>
                </div>
                <q-card-actions align="right" class="q-px-md">
                  <q-btn
                    flat
                    label="Cancel"
                    color="primary"
                    @click="resetAll"
                  />
                  <q-btn
                    flat
                    type="submit"
                    :label="
                      setDataForEdit != null ? 'Edit Project' : 'Add Project'
                    "
                    color="primary"
                  />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import clientsService from "../../services/clients.service";
import usersService from "../../services/users.service";
import skillsService from "../../services/skills.service";
import skillRatingsService from "../../services/skillRatings.service";
import projectsService from "../TimeSheets../../../services/projects.service";
import functions from "../../services/functions";
export default {
  name: "FilterTeams",
  components: {},
  created() {
    this.getAllClients();
    this.getAllUsers();
    this.getAllSkills();
  },
  watch: {
    skill: function (skillObj) {
      this.userFromSkill = [];
      if (this.skill != null) {
        // console.log(skillObj.value);
        this.getAllUserBySkill(skillObj.value);
        // this.usersBySkill.forEach((user) => {
        //   if (user.skill === this.skill.value) {
        //     this.userFromSkill.push(user);
        //   }
        // });
      }
    },
    projectFilter: function (searchStr) {
      this.$emit("searchProject", searchStr);
    },
    getProjectIdForEdit: function (value) {
      this.setDataForEdit = value;
      console.log(
        "this is set data for edit:" + JSON.stringify(this.setDataForEdit)
      );
      this.optionClients.forEach((row) => {
        if (row.value === this.setDataForEdit.clientId) {
          this.client = row;
        }
      });
      this.optionUsers.forEach((row) => {
        if (row.value === this.setDataForEdit.project.poc.id) {
          this.user = row;
        }
      });
      this.optionLeads.forEach((row) => {
        if (row.value === this.setDataForEdit.project.lead.id) {
          this.lead = row;
        }
      });

      this.project = this.setDataForEdit.project.name;
      this.addProject = true;
    },
  },
  props: ["getProjectIdForEdit"],
  data() {
    return {
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
      setDataForEdit: null,
      projectFilter: "",
      addProject: false,
      client: null,
      project: "",
      skill: null,
      user: null,
      lead: null,
      clientOptions: [
        /* { label: 'Daniel', value: 'Daniel' } */
      ],
      optionClients: [
        /* clientOptions */
      ],
      newClient: "",
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
          name: "skill",
          align: "left",
          label: "Skill",
          field: "skill",
          sortable: true,
        },
        {
          name: "rate",
          align: "left",
          label: "Rating",
          field: "rate",
          sortable: true,
        },
        { name: "lead", align: "left", label: "", field: "" },
      ],
      usersBySkill: [],
      userFromSkill: [
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
      userOptions: [
        /* { label: "Rahul Holani", value: "Rahul Holani" } */
      ],
      optionUsers: [
        /* userOptions */
      ],
      optionLeads: [
        /* userOptions */
      ],
    };
  },
  methods: {
    getLeadValue(leadId, leadName) {
      console.log(leadId + ", " + leadName);
      this.userOptions.forEach((row) => {
        console.log(row);
        if (row.label === leadName) {
          this.lead = row;
          console.log("hey this is the lead: " + this.lead);
        }
      });
    },
    async getAllClients() {
      this.clientOptions = [];
      const response = await clientsService.fetchAllClients();
      response.data.forEach((client) => {
        this.clientOptions.push({
          label: client.name,
          value: client._id,
        });
      });
      this.optionClients = this.clientOptions;
      if (this.newClient !== "") {
        this.setNewClient();
      }
    },
    async getAllUsers() {
      this.userOptions = [];
      const response = await usersService.fetchUsers();
      // console.log(response);
      response.data.forEach((user) => {
        this.userOptions.push({
          label: user.firstName + " " + user.lastName,
          value: user._id,
        });
      });
      this.optionUsers = this.userOptions;
      this.optionLeads = this.userOptions;
      // console.log(this.optionUsers);
      // console.log("****************************************");
      // console.log(this.optionLeads);
    },
    async getAllSkills() {
      this.skillOptions = [];
      const response = await skillsService.fetchAllSkills();
      // console.log(response);
      response.data.forEach((skill) => {
        this.skillOptions.push({
          label: skill.name,
          value: skill._id,
        });
      });
      this.optionSkills = this.skillOptions;
    },
    async getAllUserBySkill(skill_id) {
      this.usersBySkill = [];
      const response = await skillRatingsService.fetchAllUsersBySkill(skill_id);
      console.log(response.data);
      response.data.forEach((users) => {
        console.log(users);
        this.usersBySkill.push({
          id: users.userId,
          name: users.user,
          skill: users.skill,
          rate: users.rating,
        });
      });
      this.userFromSkill = this.usersBySkill;
    },
    async createValue(val, done) {
      // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
      // only if is not already set
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
      // (adds to model if not already in the model, removes from model if already has it)
      // and it resets the input textbox to empty string
      // ----
      // If "var" content is undefined/null, then it doesn't tampers with the model
      // and only resets the input textbox to empty string

      var addNew = 1;
      if (val.length > 2) {
        this.clientOptions.forEach((option) => {
          if (option.label.toString().toLowerCase() === val.toLowerCase()) {
            addNew = 0;
          }
        });

        if (addNew == 1) {
          const prepareObj = {
            name: val,
            deleted: false,
          };
          await clientsService.addClient(prepareObj);
          this.getAllClients();
          this.newClient = val;

          // this.clientOptions.push({
          //   id: this.clientOptions.length + 1,
          //   label: val.charAt(0).toUpperCase() + val.slice(1),
          //   value: val.charAt(0).toUpperCase() + val.slice(1),
          // });
        }

        // this.optionClients = this.clientOptions;
        // this.client = this.optionClients.filter(client => client.name.toLowerCase().indexOf(val.toLowerCase())> -1);

        // filter(client =>
        //             client.clientName.toLowerCase().indexOf(searchStr.toLowerCase()) > -1
        //             ||
        //             client.projects.filter(project => project.name.toLowerCase().indexOf(searchStr.toLowerCase()) > -1).length > 0
        //         )

        // this.optionClients.forEach((client) => {
        //   console.log(client);
        //   if (client.label === val.charAt(0).toUpperCase() + val.slice(1)) {
        //     this.client = client;
        //   }
        // });
      }
    },
    setNewClient() {
      this.client = this.optionClients
        .filter(
          (client) =>
            client.label.toLowerCase().indexOf(this.newClient.toLowerCase()) >
            -1
        )
        .shift();
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.optionClients = this.clientOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionClients = [];
        this.clientOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionClients.push(option);
          }
        });
      });
    },
    filterUser(val, update) {
      if (val === "") {
        update(() => {
          this.optionUsers = this.userOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionUsers = [];
        this.userOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionUsers.push(option);
          }
        });
      });
    },
    filterLead(val, update) {
      if (val === "") {
        update(() => {
          this.optionLeads = this.userOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionLeads = [];
        this.userOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionLeads.push(option);
          }
        });
      });
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
      let object = {
        name: this.project,
        client: this.client.value,
        POC: this.user.value,
        lead: this.lead.value,
      };
      if (this.setDataForEdit != null) {
        let project_id = this.setDataForEdit.project.id;
        console.log("EditProjectData: " + JSON.stringify(object));
        const response = await projectsService.editProject(project_id, object);
        console.log("EditProjectData: " + JSON.stringify(response));
        this.resetAll();
        this.$emit('refreshGetAllProject');
      } else {
        console.log("AddProjectData: " + JSON.stringify(object));
        const response = await projectsService.addProject(object);
        console.log("AddProjectData: " + JSON.stringify(response));
        this.resetAll();
        this.$emit('refreshGetAllProject');
      }
    },
    resetAll() {
      this.client = null;
      this.project = "";
      this.skill = null;
      this.user = null;
      this.lead = null;
      this.addProject = false;
      this.setDataForEdit = null;
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
/* .q-dialog__inner--minimized > div {
    max-width: ;
} */

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