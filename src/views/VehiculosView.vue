<template>
  <section>
    <div class="page-title">
      <div>
        <h2>Vehículos</h2>
        <p class="muted">Registro de unidades y responsables.</p>
      </div>
      <button class="btn btn-primary" @click="nuevo">+ Nuevo vehículo</button>
    </div>

    <div class="toolbar">
      <input v-model="busqueda" placeholder="Buscar por placa, marca o modelo..." />
    </div>

    <div class="panel table-wrap">
      <table>
        <thead><tr><th>Placa</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Responsable</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr v-for="v in filtrados" :key="v.id">
            <td><strong>{{ v.placa }}</strong></td><td>{{ v.marca }}</td><td>{{ v.modelo }}</td><td>{{ v.anio }}</td><td>{{ v.responsable }}</td>
            <td class="actions"><button class="link" @click="editar(v)">Editar</button><button class="link danger" @click="eliminar(v)">Eliminar</button></td>
          </tr>
          <tr v-if="!filtrados.length"><td colspan="6" class="empty">No se encontraron vehículos.</td></tr>
        </tbody>
      </table>
    </div>

    <ModalForm :open="modal" :title="editando ? 'Editar vehículo' : 'Nuevo vehículo'" @close="cerrar">
      <form @submit.prevent="guardar">
        <div class="form-grid">
          <div><label>Placa</label><input v-model.trim="form.placa" required /></div>
          <div><label>Marca</label><input v-model.trim="form.marca" required /></div>
          <div><label>Modelo</label><input v-model.trim="form.modelo" required /></div>
          <div><label>Año</label><input v-model.number="form.anio" type="number" min="1950" max="2100" required /></div>
          <div class="wide"><label>Responsable</label><input v-model.trim="form.responsable" required /></div>
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
const busqueda = ref('')
const modal = ref(false)
const editando = ref(false)
const form = reactive({ id: '', placa: '', marca: '', modelo: '', anio: new Date().getFullYear(), responsable: '' })

const filtrados = computed(() => {
  const q = busqueda.value.toLowerCase()
  return vehiculos.value.filter(v => `${v.placa} ${v.marca} ${v.modelo}`.toLowerCase().includes(q))
})

async function cargar() { vehiculos.value = (await api.get('/vehiculos')).data }
function nuevo() { Object.assign(form, { id: '', placa: '', marca: '', modelo: '', anio: new Date().getFullYear(), responsable: '' }); editando.value = false; modal.value = true }
function editar(v) { Object.assign(form, v); editando.value = true; modal.value = true }
function cerrar() { modal.value = false }
async function guardar() {
  if (editando.value) await api.put(`/vehiculos/${form.id}`, form)
  else await api.post('/vehiculos', { ...form, id: crypto.randomUUID() })
  cerrar(); await cargar()
}
async function eliminar(v) {
  if (!confirm(`¿Eliminar el vehículo ${v.placa}?`)) return
  const relacionados = (await api.get(`/mantenimientos?vehiculoId=${v.id}`)).data
  for (const item of relacionados) await api.delete(`/mantenimientos/${item.id}`)
  await api.delete(`/vehiculos/${v.id}`)
  await cargar()
}
onMounted(cargar)
</script>
