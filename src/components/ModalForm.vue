<template>
  <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-head">
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('close')">×</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ open: Boolean, title: { type: String, default: 'Formulario' } })
defineEmits(['close'])
</script>
