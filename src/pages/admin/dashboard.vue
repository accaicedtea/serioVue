<template>
  <v-bottom-navigation v-model="value" :bg-color="color" grow>
    <v-btn v-for="item in menuItems" :key="item.value" @click="selectMenuItem(item.value)" >
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
import Magazine from "@/components/admin/magazine.vue";
import Product from "@/components/admin/product.vue";
import Task from "@/components/admin/task.vue";
import Scontrino from "@/components/admin/scontrino.vue";
import { supabase } from "@/plugins/supabase";

export default {
  data: () => ({
    value: 3,
    selectedMenuItem: "task",
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
