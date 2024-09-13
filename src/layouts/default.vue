<template>

  <v-app-bar>
    <v-toolbar-title>{{ auth ? 'Admin' : 'myapp' }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="!auth" to="/">Home</v-btn>
    <v-btn v-if="auth" @click="logout">logout</v-btn>
    <v-btn v-else to="/login">Login</v-btn>
  </v-app-bar>

  <v-main>
    <router-view />
  </v-main>

</template>


<script>
import { supabase } from '@/plugins/supabase';

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
  methods: {
    async logout() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(error);
      } else {
        console.log("Logout successful");
        this.$router.push('/login');
      }
    },
  }
}
</script>
