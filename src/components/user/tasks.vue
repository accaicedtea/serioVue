<template>
  <v-text-field v-model="search" density="compact" label="Cerca attività" prepend-inner-icon="mdi-magnify" variant="solo-filled"
    flat hide-details single-line class="mb-2"></v-text-field>

  <v-divider></v-divider>

  <v-data-table-virtual v-model:search="search" :headers="headers" :items="boats" :custom-filter="customFilter"
    :search="search" height="400" item-value="name" class="text-h5">
    <template v-slot:item.stat="{ item }">
      <v-checkbox v-model="item.stat" hide-details @click="update_task(item)"></v-checkbox>
    </template>
  </v-data-table-virtual>
</template>

<script>
/**
 * @data
 * search: string - The search query for filtering tasks.
 * headers: Array - An array of objects representing the table headers.
 *   - title: string - The title of the header.
 *   - align: string - The alignment of the header.
 *   - key: string - The key used for sorting.
 *   - sortable: boolean - Indicates if the header is sortable.
 * boats: Array - An array of objects representing the tasks.
 *
 * @dependencies
 * supabase: Object - The Supabase client for interacting with the database.
 *
 * @methods
 * initialize: Function - Initializes the component by fetching tasks from the database.
 * customFilter: Function - Custom filter function for filtering tasks based on the search query.
 * loadItems: Function - Loads items from a fake API.
 */
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
    async update_task(item) {
      try {
      const { data, error } = await supabase
        .from('task')
        .update({ stat: !item.stat })
        .eq('name', item.name);
      if (error) {
        console.error(error);
        // Handle error here
      } else {
        // Handle success here
      }
      } catch (error) {
      console.error(error);
      // Handle error here
      }
    },
    // SERVE VERAMENTE?
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
    // ????
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
