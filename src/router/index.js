import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAppStore } from '@/stores/app'
import { supabase } from '@/plugins/supabase'
/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Middleware per il controllo di autenticazione
const authGuard = async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user != null) {
    if (to.path === '/login' || to.path === '/') {
      const { data: { role } } = await supabase
        .from('teams')
        .select('role')
        .eq('teams', user.id)
        .single();
      
      if (role === 'admin') {
        console.log('Utente admin già loggato, reindirizzamento alla dashboard admin');
        next('/admin/dashboard');
      } else if (role === 'user') {
        console.log('Utente user già loggato, reindirizzamento alla dashboard user');
        next('/user/dashboard');
      } else {
        console.log('Ruolo non riconosciuto, reindirizzamento alla home');
        next('/');
      }
    } else if (to.path.startsWith('/admin') || to.path.startsWith('/user')) {
      const roles = user.role;
      if (roles.includes('authenticated')) {
        console.log('Utente autorizzato');
        next();
      } else {
        console.log('Utente non autorizzato');
        next('/login');
      }
    } else {
      next();
    }
  } else if (user == null && (to.path.startsWith('/admin') || to.path.startsWith('/user'))) {
    console.log('Utente non autorizzato');
    next('/login');
  } else {
    next();
  }
}

router.beforeEach(authGuard) // Aggiungi il middleware di controllo di autenticazione

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
