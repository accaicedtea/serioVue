<template>
  <v-system-bar>
    <v-icon icon="mdi-wifi-strength-4"></v-icon>
    <v-icon icon="mdi-signal" class="ms-2"></v-icon>
    <v-icon icon="mdi-battery" class="ms-2"></v-icon>

    <span class="ms-2">{{ getCurrentTime() }}ciao</span>
  </v-system-bar>

  <v-container class="center">
    <router-link to="/login">
      <v-btn variant="outlined">Login</v-btn>
    </router-link>
    <router-link to="/register">
      <v-btn variant="outlined">Register</v-btn>
    </router-link>
  </v-container>


</template>


<script>
export default {
  data: () => ({

  }),
  methods: {

  },

  setup() {
    const currentTime = ref('');

    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const time = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      currentTime.value = time;
      return currentTime.value;
    };

    return {
      currentTime,
      getCurrentTime
    };
  }
}
</script>
