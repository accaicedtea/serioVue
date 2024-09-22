<template>
  <v-app-bar>
    <v-toolbar-title>{{ auth ? 'Admin' : 'myapp' }} {{ varr }}</v-toolbar-title>

    <v-spacer></v-spacer>
    <v-btn :to="auth ? '/admin/dashboard' : '/'">Home</v-btn>
    <v-btn v-if="auth" @click="logout" color="red" variant="tonal">Logout</v-btn>
    <v-btn v-else to="/login" >Login</v-btn>
  </v-app-bar>

  
    <router-view />

</template>

<script>
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
    await this.checkUser();
  },
  watch: {
    auth(newVal) {
      if (newVal) {
        this.updateUserEmail();
      } else {
        this.varr = '';
      }
    }
  },
  methods: {
    async checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user == null) {
        this.auth = false;
      } else if (user.role == "authenticated") {
        this.auth = true;
        await this.updateUserEmail();
      }
    },
    async updateUserEmail() {
      const userRet = await Preferences.get({ key: 'user' });
      const savedUser = JSON.parse(userRet.value);
      this.varr = savedUser.email;
    },
    async logout() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error(error);
        } else {
          console.log("Logout successful");
          this.auth = false; 
          await Preferences.clear();
          console.log("Preferences cleared");
          // Goto login page
          this.$router.push('/login');
        }
      } catch (error) {
        console.error(error);
      }
    },
  }
}
</script>
