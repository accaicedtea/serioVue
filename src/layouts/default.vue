<template>

  <v-app-bar>
    <v-toolbar-title>{{ auth ? 'Admin' : 'myapp' }} {{ varr }}</v-toolbar-title>

    <v-spacer></v-spacer>
    <v-btn v-if="!auth" to="/">Home</v-btn>
    <v-btn v-if="auth" @click="logout">logout</v-btn>
    <v-btn v-else to="/login">Login</v-btn>
  </v-app-bar>

  <v-main class="d-flex align-center justify-center" >
    <router-view />
  </v-main>

  <v-footer app>
    <span>&copy; 2021</span>
  </v-footer>
</template>


<script>
/**
 * @name DefaultLayout
 * @description The default layout component for the application.
 * @data
 *  - drawer: A boolean indicating whether the drawer is visible or not.
 *  - rail: A boolean indicating whether the rail is visible or not.
 *  - auth: A boolean indicating whether the user is authenticated or not. Initialized as false.
 * @dependencies
 *  - supabase: The supabase plugin used for authentication.
 * @methods
 *  - created: A lifecycle hook that is called when the component is created. It retrieves the user from supabase and sets the auth property based on the user's existence and role.
 *  - logout: A method that is called when the user clicks on the logout button. It signs out the user and redirects to the login page.
 */
import { supabase } from '@/plugins/supabase';
import { Preferences } from '@capacitor/preferences';

export default {
  name: 'DefaultLayout',
  components: {},

  data() {
    return {
      drawer: true,
      rail: true,
      auth: false, // Initialize auth as false
      varr: '',
    };
  },
  async created() {
    const { data: { user } } = await supabase.auth.getUser()// Get the user from supabase.auth.getUser()
    // console.log(user.role);
    if (user == null) {
      this.auth = false; // Set auth to false if user does not exist
    } else if (user.role == "authenticated") {

      this.auth = true; // Set auth to true if user exists
      this.varr = 'Admin';
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
