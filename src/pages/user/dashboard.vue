<template>
  <v-bottom-navigation v-model="value" :bg-color="color" grow>
    <v-btn v-for="item in menuItems" :key="item.value" @click="selectMenuItem(item.value)">
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.title }}</span>
    </v-btn>
    <v-btn @click="$router.push('/admin/dashboard')">
      <v-icon>mdi mdi-account</v-icon>
      <span>Admin Area</span>
    </v-btn>
  </v-bottom-navigation>

  <component :is="selectedMenuItem" ></component>


</template>

<script>
/**
 * @data
 * value: The current value.
 * selectedMenuItem: The currently selected menu item.
 * menuItems: An array of menu items with their titles, values, and icons.
 * 
 * @dependencies
 * Magazine: The component for the magazine.
 * Task: The component for the tasks.
 * supabase: The Supabase plugin.
 * 
 * @methods
 * selectMenuItem(value): Updates the selectedMenuItem with the given value.
 * logout(): Logs out the user and performs additional actions if successful.
 * 
 * @computed
 * color(): Returns the color based on the current value.
 */
import Magazinee from "@/components/user/magazinee.vue";
import Task from "@/components/user/tasks.vue";
import { supabase } from "@/plugins/supabase";

export default {
  data: () => ({
    value: 0,
    selectedMenuItem: "magazinee",
    menuItems: [
      { title: "Magazzino", value: "magazinee", icon: "mdi mdi-magazine-rifle" },
      { title: "Task", value: "task", icon: "mdi mdi-format-list-checks" },
    ],
  }),

  components: {
    Magazinee,
    Task,
  },
  computed: {
    color() {
      switch (this.value) {
        case 0: return 'red-darken-1'
        case 1: return 'teal'
        default: return 'blue-grey'
      }
    },
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

<style scoped>
.dashboard-widgets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
</style>