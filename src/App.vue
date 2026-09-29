<template>
  <div class="app-shell">
    <header v-if="isLogged" class="topbar">
      <div>
        <h1>Control de Mantenimiento</h1>
        <span>Gestión sencilla de vehículos y servicios</span>
      </div>
      <button class="btn btn-light" @click="logout">Cerrar sesión</button>
    </header>

    <div v-if="isLogged" class="layout">
      <aside class="sidebar">
        <div class="brand">CMV</div>
        <nav>
          <RouterLink to="/dashboard">Inicio</RouterLink>
          <RouterLink to="/vehiculos">Vehículos</RouterLink>
          <RouterLink to="/mantenimientos">Mantenimientos</RouterLink>
        </nav>
      </aside>
      <main class="content">
        <RouterView />
      </main>
    </div>

    <main v-else class="login-area">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLogged = computed(() => route.path !== '/login' && localStorage.getItem('sesion') === 'true')

function logout() {
  localStorage.removeItem('sesion')
  router.push('/login')
}
</script>
