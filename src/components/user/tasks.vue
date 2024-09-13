<template>
  <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify" variant="solo-filled"
    flat hide-details single-line class="mb-2"></v-text-field>

  <v-divider></v-divider>

  <v-data-table-virtual v-model:search="search" :headers="headers" :items="boats" :custom-filter="customFilter"
    :search="search" height="400" item-value="prodotto" class="text-h5">
    <template v-slot:item.quantity="{ value }">
      <v-chip variant="elevated" size="x-large" :color="getColor(value)" class="text-center">
        {{ value }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn rounded="lg" elevation="4" @click="incrementQuantity(item)" text color="green-lighten-1" class="me-2">
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
      <v-btn @click="decrementQuantity(item)" text color="red-accent-4">
        <v-icon>
          mdi-minus
        </v-icon>
      </v-btn>
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
          key: 'task',
          sortable: true
        },
        { title: 'Prodotto', key: 'product', sortable: true },
        { title: 'Quantità', key: 'quantity', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false },
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
      supabase.from('see_magazineee').select('*').then(response => {
        this.boats = response.data;
      });
    },
    incrementQuantity(item) {
      item.quantity++;

    },
    decrementQuantity(item) {
      if (item.quantity > 0) {
        item.quantity--;
      }
    },
    getColor(quantity) {
      if (quantity >= 10) return 'light-green-accent-2'
      else if (quantity >= 1 && quantity <= 9) return 'orange-lighten-1'
      else return 'red-darken-3'
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
