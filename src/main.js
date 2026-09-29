import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LoginView from './views/LoginView.vue'
import DashboardView from './views/DashboardView.vue'
import VehiculosView from './views/VehiculosView.vue'
import MantenimientosView from './views/MantenimientosView.vue'
import './style.css'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/vehiculos', component: VehiculosView, meta: { requiresAuth: true } },
  { path: '/mantenimientos', component: MantenimientosView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const logged = localStorage.getItem('sesion') === 'true'
  if (to.meta.requiresAuth && !logged) return '/login'
  if (to.path === '/login' && logged) return '/dashboard'
})

createApp(App).use(router).mount('#app')
