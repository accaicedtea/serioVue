<template>
  <div>
    <h1>Dashboard</h1>
    <p>Sei autenticato!</p>
    <div class="dashboard-widgets">
      <!-- Add your dashboard widgets here -->
      <Widget1 />
      <Widget2 />
      <Widget3 />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      // Add your data properties here
    };
  },
  methods: {
    // Add your methods here
  },
  mounted() {
    // Add any initialization code here
  },
};
</script>

<style scoped>
.dashboard-widgets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
</style>
