<template v-slot:text>
  <v-row no-gutters>
    <v-col cols="6" offset="6">
      <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
        single-line></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-data-table-virtual :headers="headers" :items="boats" :search="search" :height="tableHeight" density="compact" class="text-h6">
        <template v-slot:item.magazine="{ item }">
          <span>{{ item.magazine }}</span>
        </template>
        
        <template v-slot:item.product="{ item }">
          <span>{{ item.product }}</span>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <v-row class="d-flex flex-column flex-md-row">
        <v-col cols="12" md="2" xs="4">
          <v-btn @click="incrementAndSave(item, 'dec')" color="red darken-1">-</v-btn>
        </v-col>
        
        <v-col cols="12" md="4" xs="4" class="d-flex justify-center">
          <v-chip :color="getColor(item.quantity)" size="large" variant="elevated">
            {{ item.quantity }}
          </v-chip>
        </v-col>
        
        <v-col cols="12" md="4" xs="4">
          <v-btn @click="incrementAndSave(item, 'inc')" color="green lighten-1">+</v-btn>
        </v-col>
          </v-row>
        </template>
      </v-data-table-virtual>
    </v-col>
  </v-row>
</template>

<script>
/**
 * @data
 * search: string - The search query for filtering the data.
 * headers: Array - An array of objects representing the table headers.
 *   - title: string - The title of the header.
 *   - align: string - The alignment of the header.
 *   - key: string - The key used for sorting the data.
 *   - sortable: boolean - Indicates if the header is sortable.
 * boats: Array - An array of objects representing the data for the table.
 *
 * @dependencies
 * supabase: Object - The Supabase client for interacting with the database.
 * lodash
 * @methods
 * initialize: Function - Initializes the component by fetching data from the database.
 * incrementQuantity: Function - Increments the quantity of an item.
 * decrementQuantity: Function - Decrements the quantity of an item.
 * getColor: Function - Returns the color class based on the quantity value.
 * customFilter: Function - Custom filter function for filtering the data.
 * loadItems: Function - Loads items from a fake API.
 */
import { supabase } from '@/plugins/supabase';
import _ from 'lodash';
import { Preferences } from '@capacitor/preferences';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
export default {
  data() {
    return {
      search: '',
      headers: [
        {
          title: 'Magazzino',
          align: 'start',
          key: 'magazine',
          sortable: true
        },
        { title: 'Prodotto', key: 'product', sortable: true },
        { title: 'Azioni', key: 'actions', sortable: false },
      ],
      boats: [],
    }
  },
  computed: {
    tableHeight() {
      const footerHeight = 200; // Adjust this value based on your footer height
      return `calc(100vh - ${footerHeight}px)`;
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
      Preferences.set({ key: 'currentPage', value: '/user/magazinee' });
    },
    incrementAndSave(item, op) {

      if (op == 'inc') {
        item.quantity++;
        Haptics.impact({ style: ImpactStyle.Light });
      } else {
        if (item.quantity > 0) {
          item.quantity--;
          Haptics.impact({ style: ImpactStyle.Light });
        } else {
          Haptics.impact({ style: ImpactStyle.Heavy });
        }
      }
      // Clear the previous debounce function to prevent multiple updates
      if (this.debounceFunction) {
        clearTimeout(this.debounceFunction);
      }

      // Debounce the increment operation
      this.debounceFunction = _.debounce(async () => {
        // Update the item quantity in your data source
        await supabase
          .rpc('tete', {
            name_mag: item.magazine,
            name_product: item.product,
            op: 1,
            quantita: item.quantity
          })
        console.log('Updated item quantity:', item.storer, ': ', item.product, ': ', item.quantity);
        this.debounceFunction = null;
      }, 1000);

      this.debounceFunction();
    },
    getColor(quantity) {
      if (quantity >= 10) return 'light-green-accent-2'
      else if (quantity >= 1 && quantity <= 9) return 'orange-lighten-1'
      else return 'red-darken-3'
    },
  }
}
</script>
