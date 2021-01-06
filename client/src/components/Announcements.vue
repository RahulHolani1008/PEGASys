<template>
  <q-list class="rounded-borders q-pb-sm q-pt-sm">
    <q-item-label header class="q-pb-sm text-h6 text-weight-medium text-dark"
      >Announcements</q-item-label
    >
    <div class="overflow-auto announcement-box q-py-sm">
      <div v-for="announce in announcements.slice(0, 3)" :key="announce.id">
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label class="text-subtitle2 text-weight-medium" lines="1">{{
              announce.title
            }}</q-item-label>
            <q-item-label caption lines="2">
              <span class="text-weight-bold">{{ announce.writtenBy }}</span>
              {{ announce.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top> {{ announce.date }} </q-item-section>
        </q-item>
        <q-separator class="q-mx-auto change-announcement-separator" />
      </div>
      <div class="text-right q-pt-sm text-blue">
        <span class="q-pr-sm cursor-pointer">See more</span>
      </div>
    </div>
  </q-list>
</template>
<script>
import functions from "../services/functions";
export default {
  name: "AnnouncementCard",
  data() {
    return {
      announcements: [
        {
          id: 1,
          title: "HR announcement new policy",
          description: " Today 0 leave",
          date: "2020/11/06",
          writtenBy: "Rahul Holani",
        },
        {
          id: 2,
          title: "HR announcement new policy",
          description: " Today 0 leave",
          date: "2020/11/07",
          writtenBy: "Neraj Patel",
        },
        {
          id: 3,
          title: "HR announcement new policy",
          description: " Today 0 leave",
          date: "2020/11/08",
          writtenBy: "Rahul Holani",
        },
        {
          id: 4,
          title: "HR announcement new policy",
          description: " Today 0 leave",
          date: "2020/11/09",
          writtenBy: "Rahul Holani",
        },
      ],
    };
  },
};
</script>
<style>
.announcement-box {
  border: 2px solid #dadada;
  border-radius: 20px;
  outline: none;
}
.see-more-announcement {
  height: 10%;
}
.change-announcement-separator {
  width: 95%;
}
/* .announcement-box{
  padding: 1% 2% 1% 2%;
} */
</style>