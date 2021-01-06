<template>
  <div>
    <div style="text-align: right">
      <AddNewUser
        @submit="addNewUserSubmit"
        v-if="$store.getters.userType == 'admin'"
      />
      <EditUser :layout="layout" :userId="userId" @layoutFalse="layoutFalse" />
    </div>

    <div class="q-pa-md q-mt-sm">
      <q-table
        title="Users"
        :data="users"
        class="sticky-header-table"
        :columns="columns"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[10, 20, 50, 0]"
        row-key="name"
        :filter="filter"
      >
        <template v-slot:top-right>
          <q-input
            dense
            debounce="300"
            v-model="filter"
            outlined
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            color="primary"
            icon-right="archive"
            label="Export to csv"
            class="q-ml-md"
            no-caps
            @click="exportTable"
          />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <q-img
                v-if="col.name == 'image'"
                :src="col.value"
                height="40px"
                width="40px"
                style="border-radius: 100%"
              />
              <div
                v-if="
                  col.name != 'image' &&
                  col.name != 'edit' &&
                  col.name != 'delete' &&
                  col.name != 'userType'
                "
              >
                {{ col.value }}
              </div>
              <div
                v-if="
                  col.name == 'userType'
                "
                >
                  {{
                    col.value.charAt(0).toUpperCase() + col.value.slice(1)
                  }}
              </div>
              <q-btn
                size="md"
                v-if="col.name == 'edit'"
                color="orange"
                round
                dense
                @click="editUser(props.row.id)"
                icon="edit"
              />
              <q-btn
                size="md"
                color="red"
                v-if="
                  col.name == 'delete' && $store.getters.userType == 'admin'
                "
                round
                dense
                @click="removeUser(props.row.id)"
                icon="delete"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-dialog
      v-model="confirmDelete"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-negative text-white reject-timesheet">
        <q-card-section>
          <div class="text-h6">Confirm</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete this user?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            icon-right="o_cancel"
            color="negative"
            class="fs--14"
            flat
            label="Delete"
            @click="onDelete"
          ></q-btn>
          <q-btn flat color="primary" label="Close" @click="closeDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import EditUser from "../components/users/EditUser";
import AddNewUser from "../components/users/AddNewUser.vue";
import UserService from "../services/users.service";
import { exportFile } from "quasar";
import usersService from "../services/users.service";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}
import functions from "../services/functions";
export default {
  name: "Users",
  components: { AddNewUser, EditUser },
  data() {
    return {
      userId: "",
      layout: false,
      uType: "",
      pagination: 0,
      columns: [
        {
          name: "image",
          align: "center",
          label: "Image",
          field: "profileImageURL",
        },
        {
          name: "name",
          align: "center",
          label: "Name",
          field: "name",
          sortable: true,
        },
        {
          name: "departments",
          align: "center",
          label: "Departments",
          field: "departments",
        },
        {
          name: "userType",
          align: "center",
          label: "UserType",
          field: "userType",
        },
        {
          name: "genesisEmail",
          align: "center",
          label: "Email",
          field: "genesisEmail",
        },
        {
          name: "edit",
          align: "center",
          label: "Edit",
          field: "edit",
        },
        {
          name: "delete",
          align: "center",
          label: "Delete",
          field: "delete",
        },
      ],
      users: [],
      filter: "",
      confirmDelete: false,
      userToBeDeleted: null,
    };
  },
  methods: {
    layoutFalse() {
      this.layout = false;
      this.userId = '';
      this.getAllUsers();
    },
    exportTable() {
      const content = [
        this.columns
          .map((col) => {
            if (
              col.name != "edit" &&
              col.name != "delete" &&
              col.name != "image"
            )
              return wrapCsvValue(col.label);
          })
          .filter((ele) => ele != null),
      ]
        .concat(
          this.users.map((row) =>
            this.columns
              .map((col) => {
                if (
                  col.name != "edit" &&
                  col.name != "delete" &&
                  col.name != "image"
                )
                  return wrapCsvValue(
                    typeof col.field === "function"
                      ? col.field(row)
                      : row[col.field === void 0 ? col.name : col.field],
                    col.format
                  );
              })
              .filter((ele) => ele != null)
              .join(",")
          )
        )
        .join("\r\n");
      const status = exportFile("users.csv", content, "text/csv");
      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
    editUser(value) {
      this.layout = true;
      this.userId = value;
    },
    removeUser(userId) {
      this.userToBeDeleted = userId;
      this.confirmDelete = true;
    },
    async onDelete() {
      await usersService.deleteUser(this.userToBeDeleted);
      await this.getAllUsers();
      this.confirmDelete = false;
      this.userToBeDeleted = null;
    },
    async addNewUserSubmit() {
      await this.getAllUsers();
    },
    closeDelete() {
      this.confirmDelete = false;
      this.userToBeDeleted = null;
    },
    async getAllUsers() {
      var dept;
      this.users = [];
      this.uType = [];
      const response = await UserService.fetchUsers();

      response.data.forEach((data) => {
        dept = "";
        data.departments.forEach((department, index) => {
          if (index == 0) {
            dept = department.name;
          } else {
            dept = dept + " , " + department.name;
          }
        });

        this.users.push({
          id: data._id,
          profileImageURL: data.profileImageURL,
          name: data.firstName + " " + data.lastName,
          departments: dept,
          userType: data.userType,
          genesisEmail: data.emails.genesis,
          edit: "edit",
          delete: "delete",
        });
      });
    },
  },
  async mounted() {
    await this.getAllUsers();
    if (this.$store.getters.userType == "manager") {
      this.columns.pop();
    }
  },
};
</script>
 