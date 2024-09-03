<template>
  <v-system-bar>
    <v-icon icon="mdi-wifi-strength-4"></v-icon>
    <v-icon icon="mdi-signal" class="ms-2"></v-icon>
    <v-icon icon="mdi-battery" class="ms-2"></v-icon>

    <span class="ms-2">{{ getCurrentTime() }}ciao</span>
  </v-system-bar>
</template>

<script setup>
  import { ref } from 'vue';

  const currentTime = ref('');

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    currentTime.value = time;
    return currentTime.value;
  };
</script>
