<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>My App</v-toolbar-title>
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
export default {
  name: 'DefaultLayout',
  components: {},
  data() {
    return {
      auth: localStorage.getItem('auth') === 'true', // Retrieve the auth value from local storage
    };
  },
  methods: {
    logout() {
      localStorage.setItem('auth', 'false'); // Set the auth value to false
      this.auth = false; // Update the auth value
      this.$router.push('/login'); // Redirect to the login page
    },
  },
};
</script>


