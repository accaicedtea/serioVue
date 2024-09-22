<template>
  <v-text-field v-model="search" density="compact" label="Cerca prodotto" prepend-inner-icon="mdi-magnify"
    variant="solo-filled" flat hide-details single-line class="mb-2"
    :class="{ 'deep-purple-lighten-2': true }"></v-text-field>

  <v-divider></v-divider>
  <v-container>
    <v-data-table-virtual v-model:search="search" :headers="headers" :items="boats"
      :search="search"  item-value="prodotto" class="text-h5">
      <template v-slot:item.quantity="{ value }">
        <v-chip variant="elevated" size="x-large" :color="getColor(value)" class="text-center">
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn rounded="lg" elevation="4" @click="incrementAndSave(item, 'inc')" text color="green-lighten-1"
          class="me-2">
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
        <v-btn @click="incrementAndSave(item, 'dec')" text color="red-accent-4">
          <v-icon>
            mdi-minus
          </v-icon>
        </v-btn>
      </template>
    </v-data-table-virtual>
  </v-container>
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
        { title: 'Quantità', key: 'quantity', sortable: true },
        { title: 'Azioni', key: 'actions', sortable: false },
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
        }else{
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
    // SERVE VERAMENTO? NO ANZI
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
    //????
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
