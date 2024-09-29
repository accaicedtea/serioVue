<template>
  <v-container fluid class="bg-brown-lighten-5">
    <v-row class="pr-2 pl-2" no-gutters>
      <v-col cols="12" md="7" class="mb-1">
        <v-card hover>
          <v-card-item>
            <v-card-title>
              Card title
            </v-card-title>

            <v-card-subtitle>
              Card subtitle secondary text
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="4">
        <OrderExpense />
      </v-col>

    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <Scontrino />
      </v-col>
      <v-col cols="12" md="4">
        <LastOrder />
      </v-col>
    </v-row>
  </v-container>

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
import Scontrino from "@/components/admin/scontrino.vue";
import LastOrder from "@/components/admin/last-order.vue";
import { supabase } from "@/plugins/supabase";
import { Preferences } from '@capacitor/preferences';
import OrderExpense from "@/components/admin/order-expense.vue";
export default {
  data: () => ({
    value: [
      423,
      446,
      675,
      510,
      590,
      610,
      760,
    ],

  }),

  components: {
    Scontrino,
    LastOrder,
    OrderExpense
  },
  computed: {
    tableHeight() {
      const footerHeight = 0; // Adjust this value based on your footer height
      return `calc(100vh - ${footerHeight}px)`;
    }
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
