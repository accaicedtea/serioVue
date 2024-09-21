<template > 
  <router-link to="/login">
      <v-btn variant="outlined" size="x-large">Login</v-btn>
    </router-link>
</template>


<script>
// import _ from 'lodash';
import { Preferences } from '@capacitor/preferences';

export default {
  data() {
    return {

    };
  },
  methods: {
    async getObject() {
      const ret = await Preferences.get({ key: 'user' });
      const user = JSON.parse(ret.value);
      console.log(`Hello ${user}!`);
    },
    async printObj() {
      const { value } = await Preferences.get({ key: 'name' });

      console.log(`Hello ${value}!`);
    },
  },
};
</script>