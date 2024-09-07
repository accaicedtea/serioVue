<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title >{{ auth ? 'authenticated': 'myapp' }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!auth" to="/">Home</v-btn>
      <v-btn v-if="auth" to="/user/layout">magazine</v-btn>
      <v-btn v-if="auth" to="/user/tasks">task</v-btn>
      <v-btn v-if="auth" @click="logout()">logout</v-btn>
      <v-btn v-else to="/login">Login</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { supabase } from '../plugins/supabase';

export default {
  name: 'DefaultLayout',
  components: {},
  data() {
    return {
      auth: false, // Initialize auth as false
    };
  },
  async created() {
    const { data: { user } } = await supabase.auth.getUser()// Get the user from supabase.auth.getUser()
    // console.log(user.role);
    if(user==null){
      this.auth = false; // Set auth to false if user does not exist
    }else if (user.role == "authenticated") {
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
