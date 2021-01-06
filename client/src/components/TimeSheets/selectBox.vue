<template>
  <div>
    <q-select
      outlined
      use-input
      multiple
      popup-content-class="filter-w-checkbox rei-filter-content"
      :options="model"
      v-model="selector"
      label="Selector"
      class="col-grow q-py-none q-pr-none skill-selector"
      behavior="menu"
      emit-value
      map-options
    >
      <template v-slot:append v-if="groupSelected.length > 0">
        <span class="single-fltr-sel-clear">
          <q-icon
            name="clear"
            class="cursor-pointer"
            style="font-size: 16px"
            @click="clearSingleFilter"
          />
        </span>
      </template>
      <span>
        {{ selectedString }}
      </span>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" class="byproject-selection">
          <q-item-section side class="full-width q-pr-none">
            <q-list class="full-width">
              <q-item :key="scope.opt.id">
                <!-- {{ scope.opt }} -->
                <div class="row col-12">
                  <div class="col-auto">
                    <q-checkbox
                      v-model="model[scope.index].checked"
                      @input="selectGroup(scope.opt, scope.index)"
                    />
                  </div>
                  <div class="col-grow">
                    <q-expansion-item expand-separator :label="scope.opt.label">
                      <q-list>
                        <q-item
                          v-for="(dept, indexDeptId) in scope.opt.options"
                          :key="indexDeptId"
                          class="full-width"
                        >
                          <q-checkbox
                            class="full-width"
                            :label="dept.name"
                            v-model="
                              model[scope.index].options[indexDeptId].checked
                            "
                            @input="
                              selectSubGroup(
                                dept,
                                scope.opt,
                                indexDeptId,
                                scope.index
                              )
                            "
                          />
                          <!-- {{ dept }}tt{{ scope.opt }}tt{{ indexDeptId }}tt -->
                          <!-- {{ scope.index }} -->
                        </q-item>
                      </q-list>
                    </q-expansion-item>
                  </div>
                </div>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <!-- {{ model }} -->
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
      groupSelected: [], //{ id: "", options: [], names: [], parent: "" },
      selector: [],
      model: [
        {
          label: "Person",
          id: 1,
          checked: false,
          options: [],
        },
        {
          label: "Skills",
          id: 2,
          checked: false,
          options: [],
        },
      ],
    };
  },
  watch: {
    // groupSelected: function (value) {
    //   this.$emit("selectedBox", value);
    // },
    model: {
      handler: function (val) {
        this.groupSelected = [];
        // this.selectManage(val);
        val.forEach((parentData) => {
          if (parentData.checked) {
            this.groupSelected.push({
              clientId: parentData.id,
              clientName: parentData.label,
              project: [],
            });
            parentData.options.forEach((childData) => {
              if (childData.checked) {
                this.groupSelected.project.push({
                  projectId: childData.id,
                  projectName: childData.name,
                });
              }
            });
          }
        });
        console.log("model: " + this.listData);
        this.$emit("selectedBox", this.listData);
      },
      deep: true,
    },
  },
  methods: {
    selectManage(val) {
      val.forEach((optn) => {
        optn.options.forEach((child) => {
          if (child.checked) {
            optn.checked = true;
          }
        });
      });
    },
    async getUserList() {
      //   var pId = 100;
      //   this.listData = [];
      //   if (this.groupSelected.id == 0) {
      //     const response = await usersService.fetchUsers();
      //     response.data.forEach((user) => {
      //       user.departments.forEach((dept) => {
      //         if (this.groupSelected.options.includes(dept._id)) {
      //           var found;
      //           if (this.listData.length > 0)
      //             found = this.listData.some((list) => list.id === user._id);
      //           else found = false;
      //           if (!found) {
      //             this.listData.push({
      //               fname: user.firstName,
      //               lname: user.lastName,
      //               id: user._id,
      //             });
      //             pId = 0;
      //           }
      //         }
      //       });
      //     });
      //   }
      //   if (this.groupSelected.id == 1) {
      //     const response = await skillRatingsService.fetchAllSkills();
      //     this.groupSelected.options.forEach((pskill, index) => {
      //       response.data.forEach((skill) => {
      //         this.listData.push({
      //           fname: skill.name,
      //           lname: "",
      //           id: skill._id,
      //         });
      //       });
      //     });
      //     pId = 1;
      //   }
      //   this.$emit("selectedBox", this.listData);
      //   this.$emit("parentId", pId);
    },
    selectGroup(val, idx) {
      this.Subgroup(val, idx);

      // this.rearrangeGroupSelected(val, idx);
      // if (this.model[idx].checked) {
      //   this.groupSelected.id = idx;
      //   this.groupSelected.parent = val.label;
      // } else {
      //   this.groupSelected = { id: "", options: [], names: [], parent: "" };
      // }
      // this.model[idx].options.forEach((row) => {
      //   row.checked = this.model[idx].checked;
      //   if (row.checked) {
      //     this.groupSelected.options.push(row.id);
      //     this.groupSelected.names.push(row.name);
      //   }
      // });
      // this.$forceUpdate();
      // this.onDisplaySelected();

      // // this.getUserList();
      // //console.log("selectGroup: " + JSON.stringify(this.groupSelected));
    },
    Subgroup(obj, idx) {
      if (obj.checked) {
        this.model[idx].options.forEach((optn) => {
          optn.checked = true;
        });
      } else {
        this.model[idx].options.forEach((optn) => {
          optn.checked = false;
        });
      }
      this.onDisplaySelected();
    },
    selectSubGroup(val, pval, idx, pindex) {
      if (val.checked) {
        this.model[pindex].checked = true;
      } else {
        this.model[pindex].checked = false;
      }
      this.onDisplaySelected();
    },
    // selectSubGroup(val, pval, idx, pindex) {
    //  // this.rearrangeGroupSelected(pindex);
    //  //alert(JSON.stringify(val)+""+JSON.stringify(pval)+""+ idx+""+pindex)
    //   this.groupSelected.id = pindex;
    //   this.groupSelected.parent = pval.label;
    //   if(this.groupSelected.length>0){
    //   }
    //   else{
    //   }
    //   //console.log(JSON.stringify(val));
    //   if (!this.model[pindex].options[idx].checked) {
    //     var index = this.groupSelected.options.indexOf(val.id);
    //     this.groupSelected.options.splice(index, 1);
    //     var indexOfName = this.groupSelected.names.indexOf(val.name);
    //     this.groupSelected.names.splice(indexOfName, 1);
    //     if (this.groupSelected.options.length === 0) {
    //       this.model[pindex].checked = false;
    //       this.groupSelected.id = "";
    //       this.groupSelected.parent = "";
    //       this.selectedString = "No Selected";
    //     }
    //   } else {
    //     this.model[pindex].checked = true;
    //     this.groupSelected.options.push(val.id);
    //     this.groupSelected.names.push(val.name);
    //   }
    //   this.$forceUpdate();
    //   this.onDisplaySelected();
    //   //console.log("selectSubGroup: " + JSON.stringify(this.groupSelected));
    //   this.getUserList();
    // },

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
      console.log(this.model);
      // this.selectedString = "No Selected";
      // if (this.model.length !== 0) {
      //   console.log("onDisplaySelected");
      //   this.model.forEach(pselect => {
      //     if(pselect.checked) {
      //         pselect.options.forEach(cselect => {
      //           if(cselect.checked) {

      //           }
      //       });
      //     }
      //   });

      // this.selectedString =
      //   this.groupSelected.parent +
      //   ": [" +
      //   this.groupSelected.names.join() +
      //   "]";
      // }
    },

    async getAllProjectsWithClients() {
      const response = await projectsService.fetchAllClientsProjects();
      this.model = [];
      response.data.forEach((data) => {
        data.projects.forEach((project, index) => {
          if (index == 0) {
            //  alert(data.clientId._id)
            this.model.push({
              label: data.clientId.name,
              id: data.clientId._id,
              checked: false,
              options: [
                {
                  id: project.projectId,
                  name: project.projectName,
                  checked: false,
                },
              ],
            });
          } else {
            this.model[index].options.push({
              id: project.projectId,
              name: project.projectName,
              checked: false,
            });
          }
        });
      });
      // this.$emit("selectedBox", this.listData);
    },
  },

  async mounted() {
    await this.getAllProjectsWithClients();
  },
};
</script>
<style>
.skill-selector .q-field__label {
  display: none;
}
.skill-selector .q-field__control-container {
  padding-top: 12px !important;
}
.skill-selector .q-field__native {
  display: none;
}
</style>