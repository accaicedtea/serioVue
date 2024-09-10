<template>


  <router-link to="/login">
    <v-btn variant="outlined">Login</v-btn>
  </router-link>
  <router-link to="/register">
    <v-btn variant="outlined">Register</v-btn>
  </router-link>


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
