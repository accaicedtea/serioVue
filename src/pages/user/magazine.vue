<template>
  <v-data-table-virtual :headers="headers" :items="boats" height="400" item-value="magazine">
    <template v-slot:item.actions="{ item }">
      <v-btn @click="incrementQuantity(item)" text>
        <v-icon color="red">
        mdi-plus
      </v-icon>
      </v-btn>
      <v-btn @click="decrementQuantity(item)" text>
        <v-icon color="green">
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
      headers: [
        {
          title: 'Magazine',
          align: 'start',
          key: 'magazine',
        },
        { title: 'prodotto', key: 'product' },
        { title: 'quantità', key: 'quantity' },
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
      supabase.from('see_magazine').select('*').then(response => {
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
  }
}
</script>
