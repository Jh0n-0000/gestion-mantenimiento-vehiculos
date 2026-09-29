<template>
  <section>
    <div class="page-title">
      <div>
        <h2>Mantenimientos</h2>
        <p class="muted">Servicios realizados a cada vehículo.</p>
      </div>
      <button class="btn btn-primary" @click="nuevo">+ Nuevo mantenimiento</button>
    </div>

    <div class="toolbar two">
      <input v-model="busqueda" placeholder="Buscar por tipo o detalle..." />
      <select v-model="filtroVehiculo">
        <option value="">Todos los vehículos</option>
        <option v-for="v in vehiculos" :key="v.id" :value="v.id">{{ v.placa }} - {{ v.marca }} {{ v.modelo }}</option>
      </select>
    </div>

    <div class="panel table-wrap">
      <table>
        <thead><tr><th>Fecha</th><th>Vehículo</th><th>Tipo</th><th>Detalle</th><th>Costo</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr v-for="m in filtrados" :key="m.id">
            <td>{{ m.fecha }}</td><td>{{ nombreVehiculo(m.vehiculoId) }}</td><td>{{ m.tipo }}</td><td>{{ m.detalle }}</td><td>Bs {{ Number(m.costo).toFixed(2) }}</td>
            <td class="actions"><button class="link" @click="editar(m)">Editar</button><button class="link danger" @click="eliminar(m)">Eliminar</button></td>
          </tr>
          <tr v-if="!filtrados.length"><td colspan="6" class="empty">No hay registros.</td></tr>
        </tbody>
      </table>
    </div>

    <ModalForm :open="modal" :title="editando ? 'Editar mantenimiento' : 'Nuevo mantenimiento'" @close="cerrar">
      <form @submit.prevent="guardar">
        <div class="form-grid">
          <div><label>Vehículo</label><select v-model="form.vehiculoId" required><option value="" disabled>Seleccione...</option><option v-for="v in vehiculos" :key="v.id" :value="v.id">{{ v.placa }} - {{ v.modelo }}</option></select></div>
          <div><label>Fecha</label><input v-model="form.fecha" type="date" required /></div>
          <div><label>Tipo</label><select v-model="form.tipo" required><option value="" disabled>Seleccione...</option><option>Cambio de aceite</option><option>Frenos</option><option>Servicio general</option><option>Llantas</option><option>Reparación</option></select></div>
          <div><label>Costo (Bs)</label><input v-model.number="form.costo" type="number" min="0" step="0.01" required /></div>
          <div class="wide"><label>Detalle</label><textarea v-model.trim="form.detalle" rows="3" required></textarea></div>
        </div>
        <div class="modal-actions"><button type="button" class="btn btn-secondary" @click="cerrar">Cancelar</button><button class="btn btn-primary">Guardar</button></div>
      </form>
    </ModalForm>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import api from '../services/api'
import ModalForm from '../components/ModalForm.vue'

const vehiculos = ref([])
const mantenimientos = ref([])
const busqueda = ref('')
const filtroVehiculo = ref('')
const modal = ref(false)
const editando = ref(false)
const form = reactive({ id: '', vehiculoId: '', fecha: new Date().toISOString().slice(0, 10), tipo: '', detalle: '', costo: 0 })

const filtrados = computed(() => mantenimientos.value.filter(m => {
  const q = busqueda.value.toLowerCase()
  const texto = `${m.tipo} ${m.detalle}`.toLowerCase()
  return texto.includes(q) && (!filtroVehiculo.value || m.vehiculoId === filtroVehiculo.value)
}))

function nombreVehiculo(id) {
  const v = vehiculos.value.find(item => item.id === id)
  return v ? `${v.placa} - ${v.marca} ${v.modelo}` : 'Sin vehículo'
}
async function cargar() {
  const [v, m] = await Promise.all([api.get('/vehiculos'), api.get('/mantenimientos')])
  vehiculos.value = v.data; mantenimientos.value = m.data
}
function nuevo() { Object.assign(form, { id: '', vehiculoId: '', fecha: new Date().toISOString().slice(0, 10), tipo: '', detalle: '', costo: 0 }); editando.value = false; modal.value = true }
function editar(m) { Object.assign(form, m); editando.value = true; modal.value = true }
function cerrar() { modal.value = false }
async function guardar() {
  if (editando.value) await api.put(`/mantenimientos/${form.id}`, form)
  else await api.post('/mantenimientos', { ...form, id: crypto.randomUUID() })
  cerrar(); await cargar()
}
async function eliminar(m) {
  if (!confirm('¿Eliminar este mantenimiento?')) return
  await api.delete(`/mantenimientos/${m.id}`); await cargar()
}
onMounted(cargar)
</script>
