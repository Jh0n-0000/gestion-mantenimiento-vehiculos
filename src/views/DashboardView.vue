<template>
  <section>
    <div class="page-title">
      <div>
        <h2>Resumen</h2>
        <p class="muted">Consulta rápida del estado del sistema.</p>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card"><span>Vehículos</span><strong>{{ vehiculos.length }}</strong></div>
      <div class="stat-card"><span>Mantenimientos</span><strong>{{ mantenimientos.length }}</strong></div>
      <div class="stat-card"><span>Costo registrado</span><strong>Bs {{ total.toFixed(2) }}</strong></div>
    </div>

    <div class="panel welcome">
      <h3>Bienvenido al sistema</h3>
      <p>Desde el menú puedes registrar vehículos y llevar el control de sus mantenimientos.</p>
      <div class="quick-actions">
        <RouterLink class="btn btn-primary" to="/vehiculos">Gestionar vehículos</RouterLink>
        <RouterLink class="btn btn-secondary" to="/mantenimientos">Gestionar mantenimientos</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../services/api'

const vehiculos = ref([])
const mantenimientos = ref([])
const total = computed(() => mantenimientos.value.reduce((sum, item) => sum + Number(item.costo || 0), 0))

async function cargar() {
  const [v, m] = await Promise.all([api.get('/vehiculos'), api.get('/mantenimientos')])
  vehiculos.value = v.data
  mantenimientos.value = m.data
}
onMounted(cargar)
</script>
