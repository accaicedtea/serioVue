<template>
  <div>
    <v-btn href="/admin/dashboard">Admin Dashboard</v-btn>
    <v-btn href="/user/dashboard">User Dashboard</v-btn>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style>
/* Add your custom styles here */
</style>
