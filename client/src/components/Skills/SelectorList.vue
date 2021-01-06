<template>
  <div>
    <q-list class="q-py-sm">
      <div class="overflow-auto scroll-area select-list-box">
        <div v-for="(data, index) in selectedData" :key="index">
          <q-item
            scroll
            clickable
            v-ripple
            :active="link === data"
            @click="link = data"
            active-class="my-menu-link"
            class="q-pa-none"
          >
            <q-item-section>
              <q-item-label
                @click="OnSelect(data.id)"
                class="text-subtitle2 text-weight-medium"
                style="padding: 16px"
                active-class="text-orange-10 mnu_active"
                >{{ data.fname }} {{ data.lname }}</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-separator class="q-mx-auto change-select-list-separator" />
        </div>
      </div>
    </q-list>
  </div>
</template>
<script>
import usersService from "../../services/users.service";
import functions from "../../services/functions";
export default {
  name: "SelectorList",
  data() {
    return {
      link: "inbox",
      languages: [],
    };
  },

  methods: {
    async OnSelect(value) {
      //alert("seleted " + value);
      this.$emit("userId", value);
      // console.log(this.usersService.)
    },
    // async displayData() {
    //   alert("display data");
    //   if (selectedData.id == 0) {
    //     const response = await usersService.fetchUsers();
    //     this.languages = [];
    //     response.data.forEach((user) => {
    //       user.departments.forEach((dept) => {
    //         if (selectedData.options.includes(dept.id)) {
    //           if (!this.languages.includes(user.id)) {
    //             this.languages.push({
    //               label: user.firstName,
    //               value: user.id,
    //             });
    //           }
    //         }
    //       });
    //     });
    //   }
    // },
  },
  mounted() {
    // this.displayData();
  },

  props: ["selectedData"],
};
</script>
<style>
.my-menu-link {
  color: white;
  background-color: blue;
}
.select-list-box {
  border: 2px solid #dadada;
  outline: none;
  height: 404px;
}
.change-select-list-separator {
  width: 95%;
}
/* .announcement-box{
  padding: 1% 2% 1% 2%;
} */
</style>