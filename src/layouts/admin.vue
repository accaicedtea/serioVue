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
  
    
    <router-view />
    
  
  </template>
  
  
  <script>
  import { supabase } from '../plugins/supabase';
  
  export default {
    name: 'DefaultLayout',
    components: {},
  
    data() {
      return {
        drawer: true,
        rail: true,
        auth: false, // Initialize auth as false
      };
    },
    async created() {
      const { data: { user } } = await supabase.auth.getUser()// Get the user from supabase.auth.getUser()
      // console.log(user.role);
      if (user == null) {
        this.auth = false; // Set auth to false if user does not exist
      } else if (user.role == "authenticated") {
        this.auth = true; // Set auth to true if user exists
      }
    },
    async logout() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(error);
      } else {
        console.log("Logout successful");
        this.$router.push('/login');
      }
    }
  }
  </script>
  