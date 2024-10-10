<template v-slot:text>
  <v-row no-gutters>
    <v-col cols="6" offset="6">
      <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
      single-line></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-data-table-virtual v-model:search="search" :headers="headers" :items="boats" :height="tableHeight" :search="search" item-value="name"
        class="text-h6">
        <template v-slot:item.stat="{ item }">
          <v-checkbox v-model="item.stat" hide-details @click="update_task(item)"></v-checkbox>
        </template>
      </v-data-table-virtual>
    </v-col>
  </v-row>
</template>

<script>
import { supabase } from '@/plugins/supabase'
import { Preferences } from '@capacitor/preferences';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
  computed: {
    tableHeight() {
      const footerHeight = 200; // Adjust this value based on your footer height
      return `calc(100vh - ${footerHeight}px)`;
    }
  },
  methods: {
    initialize() {
      supabase.from('task')
        .select('name,category,stat')
        .order('category', { ascending: false }) // Order by category
        .then(response => {
          this.boats = response.data;
        });
      Preferences.set({ key: 'currentPage', value: '/user/tasks' });
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
          Haptics.impact({ style: ImpactStyle.Light });
          //Haptics.notification({ type: 'error' });

        }
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    },
  }
}
</script>
