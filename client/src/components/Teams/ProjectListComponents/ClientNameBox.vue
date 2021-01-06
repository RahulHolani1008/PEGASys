<template>
    <div>
        <q-table
            class="my-sticky-virtscroll-table client-detail-box q-mb-sm overflow-hidden text-left"
            :title="client.clientName"
            dense
            :data="client.projects"
            :columns="columns"
            :row-key="client.projects.id"
            hide-bottom
            virtual-scroll
            :hide-pagination="true"
            :rows-per-page-options="[0]"
        >
            <!-- <template v-slot:top-right>
                <q-icon name="create" size="1.8rem" class="cursor-pointer float-right q-mt-xs">
                </q-icon>
            </template> -->

            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-icon @click="goForEditProject(props.row.id)" name="create" size="1.5rem" class="cursor-pointer float-right q-mt-xs"></q-icon>
                </q-td>
            </template>
            <template v-slot:body-cell-lead="props">
                <q-td :props="props">
                    {{props.row.lead.name}}
                </q-td>
            </template>
            <template v-slot:body-cell-poc="props">
                <q-td :props="props">
                    {{props.row.poc.name}}
                </q-td>
            </template>
        </q-table>
    </div>
</template>
<script>
import functions from "../../../services/functions";
export default {
  name: "ClientNameBox",
  data() {
    return {
        columns: [
            {
                name: 'name',
                required: true,
                label: 'Project',
                align: 'left',
                field: row => row.name,
                format: val => `${val}`,
                sortable: true
            },
            // { name: 'department', align: 'center', label: 'Department', field: 'department', sortable: true },
            { name: 'lead', label: 'Lead', field: 'lead', align: 'left',},
            { name: 'poc', label: 'POC', field: 'poc', align: 'left', },
            { name: 'actions', label: 'Actions', field: 'actionsx', align: 'right', }
        ],
        data: [],
        
    };
  },
  props: {
    client: Object,
  },
  watch: {
    //   client: function(value) {
    //       console.log(value);
    //   }
  },
  mounted() {},
  methods: {
    goForEditProject(value) {
      // console.log();
      // console.log(value);
      const editObj = { clientId: this.client.clientId, projectId: value };
      this.$emit("openEditByProjectId", editObj);
    },
  },
};
</script>