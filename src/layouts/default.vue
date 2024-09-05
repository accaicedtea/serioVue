<template>

  <v-app>
    <v-app-bar>
      <v-toolbar-title>My App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/">Home</v-btn>
      <v-btn to="/about">About</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>


  </v-app>
</template>

<script setup>
//
</script>
