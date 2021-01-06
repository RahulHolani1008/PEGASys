<template>
  <div class="">
    <!-- <q-select
          dense
          outlined
          v-model="project"
          :options="optionProjects"
          label="Projects"
          multiple
          emit-value
          map-options
          use-input
          @filter="filterFn"
      >
        <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
          <q-item
            v-bind="itemProps"
            v-on="itemEvents"
          >
            <q-item-section side>
              <q-toggle :value="selected" @input="toggleOption(opt)" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="opt.label" ></q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select> -->

    <q-select
      dense
      input-debounce="0"
      outlined
      fill-input
      multiple
      use-chips
      v-model="selectedData"
      :options="optionProjects"
      label="Project"
      use-input
      @filter="filterFn"
    >
      <template v-slot:option="scope">
        <div class="row col-12">
          <div class="col-12 add-timesheet-select-project">
            <q-checkbox
              v-model="optionProjects[scope.index].checked"
              @input="selectGroup(scope.opt, scope.index)"
              :label="optionProjects[scope.index].label"
            />
          </div>
        </div>
      </template>
    </q-select>
  </div>
</template>
<script>
import projectsService from "../TimeSheets../../../services/projects.service";
import functions from "../../services/functions";
export default {
  name: "SelectorBox",
  data() {
    return {
      selectedString: "No Selected",

      groupSelected: [],
      project: [],
      selectedData: [],
      selected: null,
      // listData: [],
      //client:[{clientName: "",clientId:"",projects: []}],
      projectOptions: [],
      optionProjects: [],
    };
  },
  watch: {
    selectedData: {
      handler: function (newValue) {
        var b = true;
        console.log("optionProjecct" + JSON.stringify(this.optionProjects));
        this.optionProjects.forEach((opdata, index) => {
          console.log(newValue);
          newValue.forEach((sdata) => {
            // console.log(opdata.value);
            // console.log(sdata.value);
            if (opdata.value == sdata.value) {
              b = false;
            }
          });
          if (b) {
            this.optionProjects[index].checked = false;
          }
          b = true;
        });
      },
      deep: true,
    },
    projectOptions: {
      handler: function (newValue) {
        // alert(this.mainprojects+"  "+newValue)
        var sendProjects = [];

        newValue.forEach((val) => {
          if (val.checked) {
            sendProjects.push(val);
          }
        });
        //alert(JSON.stringify(sendProjects))
        this.$emit("projects", sendProjects);
      },
      deep: true,
    },
  },
  methods: {
    toggleOption(opt) {
      // console.log("^*******************************");
      // console.log(opt);
    },
    selectGroup(obj, idx) {
      console.log("Before: " + JSON.stringify(obj));
      if (obj.checked) {
        obj.checked = true;
        this.selectedData.push(obj);
      } else {
        obj.checked = false;
        var str = this.selectedData.indexOf(obj);
        //alert(str);
        this.selectedData.splice(str, 1);
        //var arr = this.selectedData;

        // this.selectedData = arr.filter((val) => {
        //   val != obj.label;
        // });
      }
      console.log("later: " + JSON.stringify(this.selectedData));
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.optionProjects = this.projectOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionProjects = [];
        this.projectOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionProjects.push(option);
          }
        });
      });
    },

    rearrangeGroupSelected(selectedObject, index) {
      if (
        this.groupSelected.length > 0 &&
        this.groupSelected !== selectedObject
      )
        //{
        console.log("hello inside1: " + JSON.stringify(selectedObject.id));
      console.log("here: " + JSON.stringify(this.model[index].options));
      var arr = [];
      this.model[index].options.forEach((ele) => {
        arr.push(ele.id);
      });

      this.model[index].checked = true;
      this.model[index].options.forEach((row) => {
        row.checked = this.model[index].checked;
        if (row.checked) {
          if (this.groupSelected.options.length > 0) {
            this.groupSelected.options.push(row.id);
          } else {
            this.groupSelected.push({
              id: selectedObject.id,
              options: [row.id],
              checked: true,
            });
          }

          //     this.groupSelected.options.push(row.id);
          //     this.groupSelected.names.push(row.name);
        }
      });
      console.log(JSON.stringify(this.groupSelected));
      return false;
      // this.groupSelected = { id: "", options: [], names: [], parent: "" };
      // }
    },

    clearSingleFilter() {
      this.model.forEach((project) => {
        project.checked = false;
        project.options.forEach((option) => {
          option.checked = false;
        });
      });
      this.groupSelected = { id: "", options: [], names: [], parent: "" };
      this.selectedString = "No Selected";
      this.$forceUpdate();
      this.getUserList();

      //console.log(this.groupSelected.options.length);
    },
    onDisplaySelected() {
      this.selectedString = "No Selected";
      if (this.groupSelected.options.length !== 0) {
        this.selectedString =
          this.groupSelected.parent +
          ": [" +
          this.groupSelected.names.join() +
          "]";
      }
    },

    async getAllProjects() {
      this.projectOptions = [];

      const response = await projectsService.fetchAllProjects();
      response.data.forEach((project) => {
        this.projectOptions.push({
          value: project._id,
          label: project.name,
          checked: false,
        });
      });
      // console.log(this.projectOptions);
      // console.log(this.gotProject);

      this.optionProjects = this.projectOptions;

      this.projectOptions.forEach((project) => {
        if (this.gotProject.includes(project.label.toLowerCase())) {
          project.checked = true;
          this.selectedData.push(project);
        }
      });
    },
    // async getAllProjectsWithClients() {
    //   const response = await projectsService.fetchAllClientsProjects();
    //   // alert("mbnm")
    //   this.model = [];
    //   response.data.forEach((data) => {
    //     data.projects.forEach((project, index) => {
    //       if (index == 0) {
    //         //  alert(data.clientId._id)
    //         this.model.push({
    //           label: data.clientId.name,
    //           id: data.clientId._id,
    //           checked: false,
    //           options: [
    //             {
    //               id: project.projectId,
    //               name: project.projectName,
    //               checked: false,
    //             },
    //           ],
    //         });
    //       } else {
    //         this.model[index].options.push({
    //           id: project.projectId,
    //           name: project.projectName,
    //           checked: false,
    //         });
    //       }
    //     });
    //   });
    //   // this.$emit("selectedBox", this.listData);
    // },
  },

  async mounted() {
    // await this.getAllProjectsWithClients();
    await this.getAllProjects();
  },
  props: {
    gotProject: {
      default: () => [],
    },
  },
};
</script>
<style>
.add-timesheet-select-project .q-checkbox {
  width: 100% !important;
}
</style>