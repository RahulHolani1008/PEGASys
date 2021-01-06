<template>
  <div class="row">
    <div v-for="eventType in eventTypes" :key="eventType.title" class="col-4">
      <q-list class="">
        <q-item-label
          class="q-pb-sm q-pl-sm text-h6 text-weight-medium text-dark"
          >{{ eventType.title }}</q-item-label
        >
        <div
          class="overflow-auto events-box q-py-sm"
          v-bind:class="{
            eventBoxRightBorder:
              eventType.title === 'Holidays' || eventType.title === 'Leaves',
            eventBoxLeftBorder:
              eventType.title === 'Leaves' || eventType.title === 'Birthdays',
          }"
        >
          <div v-for="event in eventType.data.slice(0, 3)" :key="event.id">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label lines="1">{{ event.title }}</q-item-label>
                <q-item-label caption lines="2">
                  {{ event.date }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator class="q-mx-auto change-separator" />
          </div>
          <div class="text-right q-pt-sm text-blue">
            <span class="q-pr-sm cursor-pointer">See more</span>
          </div>
        </div>
      </q-list>
    </div>
  </div>
</template>
<script>
import functions from "../services/functions";
export default {
  name: "AnnouncementCard",
  data() {
    return {
      eventTypes: [
        {
          title: "Holidays",
          data: [
            {
              id: 1,
              title: "Divali",
              date: "2020/11/06",
            },
            {
              id: 2,
              title: "Divali",
              date: "2020/11/06",
            },
            {
              id: 3,
              title: "Divali",
              date: "2020/11/06",
            },
            {
              id: 4,
              title: "Divali",
              date: "2020/11/06",
            },
          ],
        },
        {
          title: "Leaves",
          data: [
            {
              id: 1,
              title: "Divali",
              date: "2020/11/06",
            },
            {
              id: 2,
              title: "Divali",
              date: "2020/11/06",
            },
            {
              id: 3,
              title: "Divali",
              date: "2020/11/06",
            },
            {
              id: 4,
              title: "Divali",
              date: "2020/11/06",
            },
          ],
        },
        {
          title: "Birthdays",
          data: [
            {
              id: 1,
              title: "Divali",
              date: "2020/11/06",
            },
            {
              id: 2,
              title: "Divali",
              date: "2020/11/06",
            },
            {
              id: 3,
              title: "Divali",
              date: "2020/11/06",
            },
            {
              id: 4,
              title: "Divali",
              date: "2020/11/06",
            },
          ],
        },
      ],
    };
  },
};
</script>
<style>
.events-box {
  border: 2px solid #dadada;
  border-radius: 20px;
  outline: none;
}
.eventBoxRightBorder {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.eventBoxLeftBorder {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-left: hidden;
}
.see-more-events {
  height: 10%;
}
.change-separator {
  width: 90%;
}
</style>