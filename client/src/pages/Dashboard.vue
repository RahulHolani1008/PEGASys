<template>
  <div>
    <div class="row dashboard-calendar-announcement">
      <!-- Hello -->
      <div class="col-12 col-md-7 col-lg-6 q-pt-sm">
        <Calendar/>
      </div>
      <div class="col-12 col-md-5">
        <AnnouncementsCard />
      </div>
    </div>
    <div class="row q-mt-lg dashboard-event-piechart">
      <div class="col-12 col-md-7 col-lg-6 q-mb-none">
        <EventsCard />
      </div>
      <div class="col-12 col-md-5">
        <PieChart />
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from "../components/Calendar.vue";
import EventsCard from "../components/Events.vue";
import AnnouncementsCard from "../components/Announcements.vue";
import PieChart from "../components/PieChart.vue";
import functions from "../services/functions";
export default {
  components: {
    Calendar,
    EventsCard,
    AnnouncementsCard,
    PieChart,
  },
  methods:{
  }
};
</script>

<style>
/* .dashboard-event-piechart {
    height: 250px;
    min-height: 250px;
    max-height: 100%;
}
.dashboard-calendar-announcement {
    height: 266px;
    min-height: 266px;
    max-height: 100%;
} */
</style>