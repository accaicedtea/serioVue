<template>
  <div>
    <router-link to="/login">
      <v-btn variant="outlined" size="x-large">Login</v-btn>
    </router-link>
    <div v-if="preferences">
      <h2>Preferences:</h2>
      <ul>
        <li v-for="(value, key) in preferences" :key="key">{{ key }}: {{ value }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Preferences } from '@capacitor/preferences';

export default {
  data() {
    return {
      preferences: null,
    };
  },
  methods: {
    async getAllPreferences() {
      const keys = await Preferences.keys();
      const preferences = {};
      for (const key of keys.keys) {
        const { value } = await Preferences.get({ key });
        preferences[key] = value;
      }
      this.preferences = preferences;
    },
  },
  mounted() {
    this.getAllPreferences();
  },
};
</script>