<template>
  <div>
    <q-select
      outlined
      use-input
      use-chips
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
      <template v-slot:append v-if="groupSelected.options.length > 0">
        <span class="single-fltr-sel-clear">
          <q-icon
            name="clear"
            class="cursor-pointer"
            style="font-size: 16px"
            @click="clearSingleFilter"
          />
        </span>
      </template>
      <span class="scroll" style="max-width: 50vw">
        {{ selectedString }}
      </span>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" class="byproject-selection">
          <q-item-section side class="full-width q-pr-none">
            <q-list class="full-width">
              <q-item :key="scope.opt.id">
                <div class="row col-12">
                  <div class="col-auto">
                    <q-checkbox
                      id="parentCheck"
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
  </div>
</template>
<script>
import skillRatingsService from "../../services/skillRatings.service";
import departmentsService from "../../services/departments.service";
import skillDepartmentService from "../../services/skillDepartment.service";
import usersService from "../../services/users.service";
import functions from "../../services/functions";
export default {
  name: "SelectorBox",
  data() {
    return {
      selectedString: "No Selected",
      parentObj: "",
      groupSelected: { id: "", options: [], names: [], parent: "" },
      selector: [],
      listData: [],
      model: [
        {
          label: "Person",
          id: 1,
          checked: true,
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

  methods: {
    async getUserList() {
      var pId = 100;

      this.listData = [];
      if (this.groupSelected.id == 0) {
        const response = await usersService.fetchUsers();
        response.data.forEach((user) => {
          user.departments.forEach((dept) => {
            if (this.groupSelected.options.includes(dept._id)) {
              var found;
              if (this.listData.length > 0)
                found = this.listData.some((list) => list.id === user._id);
              else found = false;
              if (!found) {
                this.listData.push({
                  fname: user.firstName,
                  lname: user.lastName,
                  id: user._id,
                });
                pId = 0;
              }
            }
          });
        });
      }
      if (this.groupSelected.id == 1) {
        const response = await skillRatingsService.fetchAllSkills();

        this.groupSelected.options.forEach((pskill, index) => {
          response.data.forEach((skill) => {
            if (skill.department._id == pskill) {
              this.listData.push({
                fname: skill.name,
                lname: "",
                id: skill._id,
              });
            }
          });
        });

        pId = 1;
      }
      this.$emit("selectedBox", this.listData);

      this.$emit("parentId", pId);
    },
    selectGroup(val, idx) {
      this.rearrangeGroupSelected(val);
      if (this.model[idx].checked) {
        this.groupSelected.id = idx;
        this.groupSelected.parent = val.label;
      } else {
        this.groupSelected = { id: "", options: [], names: [], parent: "" };
      }

      this.model[idx].options.forEach((row) => {
        row.checked = this.model[idx].checked;

        if (row.checked) {
          this.groupSelected.options.push(row.id);
          this.groupSelected.names.push(row.name);
        }
      });
      this.$forceUpdate();
      this.onDisplaySelected();
      this.getUserList();
      //console.log("selectGroup: " + JSON.stringify(this.groupSelected));
    },
    rearrangeGroupSelected(selectedObject) {
      if (
        this.groupSelected.id !== "" &&
        this.groupSelected.id !== selectedObject
      ) {
        // console.log("hello inside1: " + this.model[this.groupSelected.id]);
        this.model[this.groupSelected.id].checked = false;
        this.model[this.groupSelected.id].options.forEach((row) => {
          row.checked = this.model[this.groupSelected.id].checked;
          if (row.checked) {
            this.groupSelected.options.push(row.id);
            this.groupSelected.names.push(row.name);
          }
        });
        this.groupSelected = { id: "", options: [], names: [], parent: "" };
      }
    },
    selectSubGroup(val, pval, idx, pindex) {
      //alert(val+"  "+pval+"   "+idx+"     "+pindex)
      this.rearrangeGroupSelected(pindex);
      this.groupSelected.id = pindex;
      this.groupSelected.parent = pval.label;
      //console.log(JSON.stringify(val));
      if (!this.model[pindex].options[idx].checked) {
        var index = this.groupSelected.options.indexOf(val.id);
        this.groupSelected.options.splice(index, 1);

        var indexOfName = this.groupSelected.names.indexOf(val.name);
        this.groupSelected.names.splice(indexOfName, 1);

        if (this.groupSelected.options.length === 0) {
          this.model[pindex].checked = false;
          this.groupSelected.id = "";
          this.groupSelected.parent = "";
          this.selectedString = "No Selected";
        }
      } else {
        this.model[pindex].checked = true;
        this.groupSelected.options.push(val.id);
        this.groupSelected.names.push(val.name);
      }
      this.$forceUpdate();
      this.onDisplaySelected();
      //console.log("selectSubGroup: " + JSON.stringify(this.groupSelected));

      this.getUserList();
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
        this.selectedString = this.groupSelected.names.join(", ");
      }
    },
    async getAllSkillDepartments() {
      const response = await skillDepartmentService.fetchAllSkillDepartments();
      this.model[1].options = [];
      response.data.forEach((skillDept) => {
        //alert("id "+skillDept._id)
        this.model[1].options.push({
          id: skillDept._id,
          name: skillDept.name,
          checked: false,
        });
      });
    },
    async getAllDepartments() {
      this.parentObj = { label: "Person", id: 1, checked: true, options: [] };
      const response = await departmentsService.fetchAllDepartment();
      this.model[0].options = [];
      response.data.forEach((department) => {
        this.model[0].options.push({
          id: department._id,
          name: department.name,
          checked: false,
        });
        this.parentObj.options.push({
          id: department._id,
          name: department.name,
          checked: false,
        });
      });
      this.selectGroup(this.parentObj, 0);
    },
  },

  mounted() {
    this.getAllSkillDepartments();
    this.getAllDepartments();

    // var obj = {
    //   label: "Person",
    //   id: 1,
    //   checked: true,
    //   options: [
    //     { id: "5fa8363481d7106b08926a27", name: "Development", checked: false },
    //     { id: "5fa836ba81d7106b08926a2a", name: "BDE", checked: false },
    //     { id: "5fa83a88d73dda55a89aefc4", name: "Testing", checked: false },
    //     { id: "5fa83a8cd73dda55a89aefc5", name: "HR", checked: false },
    //     { id: "5fa8f51bd6fae999d409ea18", name: "DevOps", checked: false },
    //   ],
    // };
    // this.selectGroup(obj,0)
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