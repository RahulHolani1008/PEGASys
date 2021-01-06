<template>
  <div class="sidebar dashboard-sidebar">
    <q-layout class="height_unset">
      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="true"
        :width="200"
        :breakpoint="100"
        bordered
        content-class="bg-grey-3"
        class="sidebar-menu-q-drawer"
        v-if="$store.getters.isAuthenticated"
      >
        <q-scroll-area class="fit full_height_toChilds">
          <q-list
            padding
            class="sidebarpadding"
            style="background-color: #373737"
          >
            <q-item
              clickable
              v-ripple
              v-show="checkRole(navItem.role)"
              v-for="navItem in routes"
              :key="navItem.name"
              @click="route(navItem.route)"
            >
              <q-item-section avatar class="text-center">
                <q-icon class="sidebar-menu-icons" :name="navItem.icon" />
                <span class="fs--10">{{ navItem.name }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>
      <q-page-container class="full-page-container">
        <q-page padding>
          <router-view></router-view>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
// import Calendar from "../components/Calendar.vue"
import functions from "../services/functions";
export default {
  name: "PageIndex",
  components: {},
  data() {
    return {
      left: false,
      showActions: false,
      toolbarButtons: [
        {
          label: "Share",
          icon: "fa fa-share",
          action: () => {
            this.$router.push("/import");
          },
        },
        {
          label: "Save",
          icon: "fa fa-save",
          action: () => {},
        },
      ],

      drawer: "",
      miniState: "",
      name: "",
      accept: true,
      routes: [
        {
          name: "Dashboard",
          icon: "o_poll",
          route: "/",
          role: "user",
        },
        {
          name: "Profile",
          icon: "person_outline",
          route: "/profile/" + this.$store.getters.userId,
          role: "user",
        },
        {
          name: "Users",
          icon: "o_group_add",
          route: "/users",
          role: "manager",
        },
        // {
        //   name: "Events",
        //   icon: "o_insert_invitation",
        //   route: "/events",
        //   role: "user",
        // },
        {
          name: "Skills",
          icon: "star_outlined",
          route: "/skills",
          role: "user",
        },
        {
          name: "Daily Reports",
          icon: "o_assignment",
          route: "/daily-reports",
          role: "user",
        },
        // {
        //   name: "Announcements",
        //   icon: "o_assignment",
        //   route: "/announcements",
        //   role: "user",
        // },
        {
          name: "Teams",
          icon: "o_group",
          route: "/teams",
          role: "manager",
        },
      ],
    };
  },
  methods: {
    onSubmit: function () {},
    onReset: function () {
      this.name = "";
      this.age = null;
    },
    route: function (value) {
      this.$router.push(value);
    },
    checkRole(role) {
      const userType = this.$store.getters.userType;
      if (role == "user") return true;
      if (
        role == "mentor" &&
        (userType == "manager" || userType == "admin" || userType == "mentor")
      )
        return true;
      if (role == "manager" && (userType == "manager" || userType == "admin"))
        return true;
      if (role == "admin" && userType == "admin") return true;
      return false;
    },
  },
};
</script>
<style>
/* .sidebarpadding {
  background-color: black;
  color: white;
  text-align: center;
  padding-top: 250px;
} */
</style>

<style>
/* .dashboard-sidebar .q-layout .q-page-container .q-page {
  /* height: 572px !important;
  min-height: 572px !important;
  max-height: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
} */
.sidebarpadding {
  color: white;
  text-align: center;
  /* padding-top: 250px; */
  padding-top: 202%;
  height: 100%;
}
.full-page-container {
  padding-left: 5% !important;
}
.sidebar-menu-q-drawer .q-drawer {
  width: 5% !important;
}
.sidebar-menu-icons {
  align-self: center;
  display: block;
}

.q-drawer--left.q-drawer--bordered {
  border-right: none !important;
}

.height_unset {
  height: unset !important;
  min-height: unset !important;
}

.q-page.q-layout-padding {
  min-height: unset !important;
  padding-bottom: 0 !important;
}

.full_height_toChilds .absolute.full-width {
  height: 100%;
}

@media (min-width: 850px) {
  .full-page-container {
    padding-left: 6% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 6% !important;
  }
}
@media (min-width: 600px) and (max-width: 850px) {
  .full-page-container {
    padding-left: 8% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 8% !important;
  }
}
@media (min-width: 500px) and (max-width: 600px) {
  .full-page-container {
    padding-left: 12% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 12% !important;
  }
}
@media (max-width: 350px) {
  .full-page-container {
    padding-left: 15% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 15% !important;
  }
}
@media (min-width: 350px) and (max-width: 500px) {
  .full-page-container {
    padding-left: 14% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 15% !important;
  }
}
</style>
