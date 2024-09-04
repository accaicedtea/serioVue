import { defineStore } from 'pinia'

// Utilities

export const useAppStore = defineStore('app', {
  state: () => ({
    auth: false
  }),
  getters: {
    isAuthenticated() {
      // Logica per verificare se l'utente è autenticato
      return this.auth;
    }
  },
  actions: {
    login() {
      // Logica per l'accesso
      this.auth = true;
    },
    logout() {
      // Logica per il logout
      this.auth = false;
    }
  }
})
