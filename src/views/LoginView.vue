<template>
  <section class="login-card">
    <div class="login-logo">CMV</div>
    <h2>Iniciar sesión</h2>
    <p class="muted">Acceso al sistema de mantenimiento</p>

    <form @submit.prevent="login">
      <label>Usuario</label>
      <input v-model.trim="usuario" required placeholder="admin" />
      <label>Contraseña</label>
      <input v-model="clave" type="password" required placeholder="admin123" />
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn btn-primary full">Ingresar</button>
    </form>

    <small>Demo: admin / admin123</small>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const usuario = ref('')
const clave = ref('')
const error = ref('')
const router = useRouter()

function login() {
  if (usuario.value === 'admin' && clave.value === 'admin123') {
    localStorage.setItem('sesion', 'true')
    router.push('/dashboard')
  } else {
    error.value = 'Usuario o contraseña incorrectos.'
  }
}
</script>
