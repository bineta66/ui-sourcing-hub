<script setup>
defineProps({
  campagnes: {
    type: Array,
    required: true // liste de strings, ex: ['Développement web / mobile + IA', 'Entrepreneuriat', ...]
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'reset'])
</script>

<template>
  <div class="d-flex align-items-center gap-3">
    <select
      class="form-select filtre-select"
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option value="">Toutes les campagnes</option>
      <option v-for="c in campagnes" :key="c" :value="c">{{ c }}</option>
    </select>

    <button
      type="button"
      class="btn btn-link reset-btn"
      @click="emit('reset')"
    >
      Réinitialiser
    </button>
  </div>
</template>

<style scoped>
.filtre-select {
  max-width: 220px;
}
.filtre-select:focus {
  box-shadow: none;
  border-color: #D20C4F;
}
.reset-btn {
  color: #D20C4F;
  text-decoration: none;
  font-weight: 600;
}
</style>