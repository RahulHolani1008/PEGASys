<template>
  <div>
    <div v-for="(event, index) in events" :key="event.title" class="row">
      <div v-if="index % 2 == 0" style="text-align: left" class="col-12">
        <q-img
          :src="event.url"
          style="
            border-radius: 100%;
            height: 150px;
            width: 150px;
            margin-top: 20px;
            float: left;
          "
          class="col-2"
        >
        </q-img>

        <div
          class="col-10"
          style="margin-top: -10px; margin-left: 150px; padding-left: 20px"
        >
          <h4>{{ event.title }}</h4>
          <p style="margin-top: -35px" v-html="event.description"></p>
          <p>{{ event.date }}</p>
        </div>
      </div>
      <div v-else class="col-12">
        <q-img
          :src="event.url"
          style="
            border-radius: 100%;
            height: 150px;
            width: 150px;
            margin-top: 20px;
            margin-right: 20px;
            float: right;
          "
          class="col-2"
        >
        </q-img>

        <div
          class="col-10"
          style="margin-top: -10px; margin-right: 190px; text-align: right"
        >
          <h4>{{ event.title }}</h4>
          <p style="margin-top: -35px" v-html="event.description"></p>
          <p>{{ event.date }}</p>
        </div>
      </div>
    </div>
    <div style="position: fixed; bottom: 20px; left: 50px">
      <EventDialog @submit="onAddEventSubmit" />
    </div>
  </div>
</template>
<script>
import functions from "../services/functions";
import EventService from "../services/events.service";
import EventDialog from "../components/EventDialog";

export default {
  components: { EventDialog },
  name: "Events",
  data() {
    return {
      events: [],
      img: "",
    };
  },
  methods: {
    async getUpcomingEvents() {
      const response = await EventService.fetchUpcomingEvents();
      this.events = [];
      response.data.forEach((event) => {
        if (event.pictures == "") {
          this.img =
            "https://images.emojiterra.com/google/android-oreo/512px/1f389.png";
        } else {
          this.img = event.pictures[0];
        }
        this.events.push({
          url: this.img,
          description: event.description,
          title: event.title,
          date: functions.convertDateToDate(event.date),
        });
      });
    },
    async onAddEventSubmit() {
      await this.getUpcomingEvents();
    },
  },
  mounted() {
    this.getUpcomingEvents();
  },
};
</script>