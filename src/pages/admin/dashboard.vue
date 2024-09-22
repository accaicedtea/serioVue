<template>
  <v-bottom-navigation v-model="value" :bg-color="color">
    <v-btn v-for="item in menuItems" :key="item.value" @click="selectMenuItem(item.value)">
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.title }}</span>
    </v-btn>
    <v-btn @click="$router.push('/user/dashboard')">
      <v-icon>mdi mdi-account</v-icon>
      <span>User Area</span>
    </v-btn>
  </v-bottom-navigation>

  <component :is="selectedMenuItem"></component>
</template>

<script>
/**
 * @data
 * value: The current value.
 * selectedMenuItem: The selected menu item.
 * menuItems: The list of menu items.
 *   - title: The title of the menu item.
 *   - value: The value of the menu item.
 *   - icon: The icon of the menu item.
 *
 * @dependencies
 * Magazine: The component for the magazine.
 * Product: The component for the product.
 * Task: The component for the task.
 * Scontrino: The component for the scontrino.
 * supabase: The Supabase plugin.
 *
 * @methods
 * selectMenuItem: Sets the selected menu item.
 *   - value: The value of the menu item to be selected.
 * logout: Logs out the user.
 */
import Magazine from "@/components/admin/magazine.vue";
import Product from "@/components/admin/product.vue";
import Task from "@/components/admin/task.vue";
import Scontrino from "@/components/admin/scontrino.vue";
import { supabase } from "@/plugins/supabase";
import { Preferences } from '@capacitor/preferences';
export default {
  data: () => ({
    value: 0,
    selectedMenuItem: "scontrino",
    menuItems: [
      { title: "Scontrino", value: "scontrino", icon: "mdi mdi-receipt" },
      { title: "Task", value: "task", icon: "mdi-calendar-check-outline" },
      { title: "Prodotti", value: "product", icon: "mdi mdi-chart-ppf" },
      { title: "Magazzini", value: "magazine", icon: "mdi mdi-magazine-rifle" },
    ],
  }),

  components: {
    Magazine,
    Product,
    Task,
    Scontrino,
  },
  computed: {
    color() {
      switch (this.value) {
        case 0: return 'blue-grey'
        case 1: return 'teal'
        case 2: return 'brown'
        case 3: return 'indigo'
        default: return 'blue-grey'
      }
    },
  },
  async created() {
    try {
      const { value } = await Preferences.get({ key: 'selectedAdmin' });
      console.log('selectedAdmin:', value);
      if (value) {
        this.selectedMenuItem = value;
      }
    } catch (error) {
      console.error('Error fetching selectedAdmin from preferences:', error);
    }
  },
  methods: {
    selectMenuItem(value) {
      this.selectedMenuItem = value;
    },
    async logout() {
      const { data, error } = await supabase.auth.signOut();
      if (error) {
        console.error(error);
        // Handle logout error
      } else {
        this.$router.push('/login');
        console.log("Logout successful");
        // Perform any additional actions after logout
      }
    }
  },
};
</script>

<style scoped></style>
