<template>
  <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify" variant="solo-filled"
    flat hide-details single-line class="mb-2"></v-text-field>

  <v-divider></v-divider>

  <v-data-table-virtual v-model:search="search" :headers="headers" :items="boats" :custom-filter="customFilter"
    :search="search" height="400" item-value="name" class="text-h5">
    <template v-slot:item.stat="{ item }">
      <v-checkbox v-model="item.stat" hide-details></v-checkbox>
    </template>
  </v-data-table-virtual>
</template>

<script>
import { supabase } from '@/plugins/supabase'
export default {
  data() {
    return {
      search: '',
      headers: [
        {
          title: 'Task',
          align: 'start',
          key: 'name',
          sortable: true
        },
        { title: 'Categoria', key: 'category', sortable: true },
        { title: 'Stato', key: 'stat', sortable: true },
      ],
      boats: [],
    }
  },
  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.boats;
      console.log("query");
      supabase.from('task').select('name,category,stat').then(response => {
        this.boats = response.data;
      });
    },
    customFilter(value, query, item) {
      return value != null &&
        query != null &&
        typeof value === 'string' &&
        value.toString().indexOf(query) !== -1 ||
        item.product != null &&
        query != null &&
        typeof item.product === 'string' &&
        item.product.toString().indexOf(query) !== -1;
    },
    loadItems() {
      this.loading = true
      FakeAPI.fetch().then(({ items, total }) => {
        this.boats = items
        this.loading = false
      })
    },
  }
}
</script>
