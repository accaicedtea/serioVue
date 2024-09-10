<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
    <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" title="John Leider" nav>
      <template v-slot:append>
        <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" to="/"></v-list-item>

      <v-list-item v-for="item in menuItems" :key="item.value" :value="item.value" @click="selectMenuItem(item.value)">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>

  <v-container>
    <h1>Main Content</h1>
    <component :is="selectedMenuItem"></component>
  </v-container>

</template>

<script>
import Magazine from "@/components/user/magazine.vue";
import Task from "@/components/user/tasks.vue";
import { supabase } from "@/plugins/supabase";

export default {

  data: () => ({
    drawer: true,
    rail: true,
    selectedMenuItem: "magazine",
    menuItems: [
      { title: "Magazzini", value: "magazine", icon: "mdi mdi-magazine-rifle" },
      { title: "Task", value: "task", icon: "mdi mdi-format-list-checks" },
    ],
  }),

  components: {
    Magazine,
    Task,
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