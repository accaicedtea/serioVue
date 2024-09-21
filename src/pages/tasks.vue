<template>
  <v-container fill-height fluid class="d-flex align-center  flex-column justify-center mb-6 bg-surface-variant">
    <v-btn class="mb-2"href="/admin/dashboard">Admin Dashboard</v-btn>
    <v-btn href="/user/dashboard">User Dashboard</v-btn>

  </v-container>
</template>





<script>
import { Preferences } from '@capacitor/preferences';
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async print() {
      const ret = await Preferences.get({ key: 'user' });
      const user = JSON.parse(ret.value);
      console.log(`Hello ${user.name}!`);
    },
  }
}
</script>

<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
