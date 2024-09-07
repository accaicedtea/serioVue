<template>
  <v-navigation-drawer floating permanent class="bg-deep-purple">
    <v-list density="compact" nav>
      <v-list-item v-for="item in menuItems" :key="item.value" :prepend-icon="item.icon" :title="item.title"
        :value="item.value" @click="selectMenuItem(item.value)"></v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="logout()">
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-container>
    <h1>Main Content</h1>
    <component :is="selectedMenuItem"></component>
  </v-container>

</template>

<script>
import Magazine from "@/pages/admin/magazine.vue";
import Product from "@/pages/admin/product.vue";
import Task from "@/pages/admin/task.vue";
import { supabase } from "@/plugins/supabase";

export default {
  data: () => ({
    selectedMenuItem: "task",
    menuItems: [
      { title: "Task", value: "task", icon: "mdi-calendar-check-outline" },
      { title: "Prodotti", value: "product", icon: "mdi mdi-chart-ppf" },
      { title: "Magazzini", value: "magazine", icon: "mdi mdi-magazine-rifle" },
    ],
  }),

  components: {
    Magazine,
    Product,
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
