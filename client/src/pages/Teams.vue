<template>
  <div class="teamsPage">
    <div class="row">
      <div class="col-12">
        <FilterTeams
          :getProjectIdForEdit="editData"
          @searchProject="getSearchProjectInput"
          @refreshGetAllProject="refreshGetAllProject"
        />
      </div>
      <div class="col-12 filterRow q-mt-sm">
        <ProjectList
          :clients="allProject"
          :searchProject="searchProject"
          @openEditWithProjectId="getProjectId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FilterTeams from "../components/Teams/FilterTeams.vue";
import ProjectList from "../components/Teams/ProjectList.vue";
import projectsService from "../services/projects.service";

import functions from "../services/functions";
export default {
  name: "Teams",
  created() {
    this.getAllProjects();
  },
  components: {
    FilterTeams,
    ProjectList,
  },
  data() {
    return {
      allProject: [],
      clients: [
        // {
        //     clientId: "5fd88a1f3268464358710c9d",
        //     clientName: 'Daniel',
        //     projects: [
        //         {
        //             id: 1,
        //             name: 'Hunter',
        //             department: 'Development',
        //             lead: 'Shrikant Jaiswal',
        //             poc: 'Rahul holani',
        //             spentTimeTotal: 150
        //         },
        //     ],
        //     users: [
        //         {
        //             id: 8,
        //             name: 'Rahul Holani',
        //             totalTimeSpent: 180       //Total time [40 + 50 + 90] in differet project of same client
        //         },
        //     ],
        //     opt: [
        //         [250, 10],       //[ hours, weeks ]
        //         [300, 15],
        //         [350, 20],
        //         [400, 10],
        //         [450, 5],
        //         [500, 2],
        //         [550, 40]
        //     ]
        // },
      ],
      searchProject: "",
      editData: "",
    };
  },
  methods: {
    getSearchProjectInput(searchStr) {
      this.searchProject = searchStr;
    },
    getProjectId(editObj) {
      console.log(editObj);
      var newEditObj = null;
      this.allProject.forEach((client) => {
        if (editObj.clientId === client.clientId) {
          client.projects.forEach((project) => {
            if (project.id == editObj.projectId) {
              newEditObj = { clientId: client.clientId, project: project };
            }
          });
        }
      });
      if (newEditObj != null) {
        this.editData = newEditObj;
      } else {
        alert("Sorry!");
      }
    },
    refreshGetAllProject(){
      this.getAllProjects();
      console.log('hey');
    },
    async getAllProjects() {
      this.allProject = [];
      console.log('hey there');
      const response = await projectsService.fetchAllProjects();
      var checkUniqueClient = [];
      checkUniqueClient.push("5vhiue");
      response.data.forEach((projects) => {
        if (!checkUniqueClient.includes(projects.client._id)) {
          console.log('hello');
          checkUniqueClient.push(projects.client._id);
          this.allProject.push({
            clientId: projects.client._id,
            clientName: projects.client.name,
            projects: [
              {
                id: projects._id,
                name: projects.name,
                lead: {
                  id: projects.lead._id,
                  name: projects.lead.firstName + " " + projects.lead.lastName,
                },
                poc: {
                  id: projects.POC._id,
                  name: projects.POC.firstName + " " + projects.POC.lastName,
                },
              },
            ],
          });
        } else {
          console.log('hello from the else');
          var index = this.allProject.findIndex(
            (x) => x.clientId == projects.client._id
          );
          this.allProject[index].projects.push({
            id: projects._id,
            name: projects.name,
            lead: {
              id: projects.lead._id,
              name: projects.lead.firstName + " " + projects.lead.lastName,
            },
            poc: {
              id: projects.POC._id,
              name: projects.POC.firstName + " " + projects.POC.lastName,
            },
          });
        }
      });
    },
  },
};
</script>

<style>
.filterRow {
  height: 467px !important;
  /* border: 1px solid #443f3f; */
  overflow-y: scroll;
}
</style>