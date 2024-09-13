<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false" class="bg-deep-purple">

    <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" title="John Leider" nav>
      <template v-slot:append>
        <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item v-for="item in menuItems" :key="item.value" :prepend-icon="item.icon" :title="item.title"
        :value="item.value" @click="selectMenuItem(item.value)"></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list nav>
        <v-list-item @click="logout()">
          <template v-slot:prepend>
            <v-icon icon="mdi-logout"></v-icon>
          </template>
          <v-list-item-title text="Logout">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>



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
    drawer: true,
    rail: true,
    selectedMenuItem: "task",
    menuItems: [
      { title: "Task", value: "task", icon: "mdi-calendar-check-outline" },
      { title: "Prodotti", value: "product", icon: "mdi mdi-chart-ppf" },
      { title: "Magazzini", value: "magazine", icon: "mdi mdi-magazine-rifle" },
      { title: "Scontrino", value: "scontrino", icon: "mdi mdi-receipt" },
    ],
  }),

  components: {
    Magazine,
    Product,
    Task,
    Scontrino,
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
