<template>
  <v-layout class="rounded rounded-md" :full-height="true">
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>My files</v-toolbar-title>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'left' : undefined" temporary>
      <v-list>
        <v-list-item v-for="item in filteredItems" :key="item.value" @click="navigate(item.value)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <router-view />
    </v-main>
  </v-layout>
</template>


<script>
import { supabase } from '@/plugins/supabase';
import { Preferences } from '@capacitor/preferences';

export default {
  name: 'DefaultLayout',
  components: {},

  data() {
    return {
      drawer: false,
      group: null,
      items: [
        {
          title: 'Home',
          value: '/',
        },
        {
          title: 'Impostazioni',
          value: '/admin/settings',
        },
        {
          title: 'Logout',
          value: 'logout',
        },
        {
          title: 'Login',
          value: 'login',
        },
      ],
      rail: true,
      auth: false,
      varr: '',
      currentDateTime: ''
    };
  },
  async created() {
    await this.checkUser();
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000); // Update every second
    const { data, error } = await supabase.auth.getSession()
    if (!data.session) {
      await Preferences.clear();
    }
  },
  computed: {
    filteredItems() {
      if (this.auth) {
        return this.items.filter(item => item.value !== 'login');
      } else {
        return this.items.filter(item => item.value === 'home' || item.value === 'login');
      }
    }
  },
  watch: {
    auth(newVal) {
      if (newVal) {
        this.updateUserEmail();
      } else {
        this.varr = '';
      }
    },
    group() {
      this.drawer = false
    },
  },
  methods: {
    navigate(value) {
      if (value === 'logout') {
        this.logout();
      } else {
        this.$router.push({ name: value });
      }
    },
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
    updateDateTime() {
      const now = new Date();
      const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
      const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const timeString = now.toLocaleTimeString();
      this.currentDateTime = `${dayName}, ${now.getDate()} ${monthName} ${now.getFullYear()} ${timeString}`;
    }
  }
}
</script>
