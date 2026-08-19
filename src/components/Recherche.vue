<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="input-group recherche-group">
    <span class="input-group-text bg-white border-end-0">
      <i class="fa-solid fa-magnifying-glass" style="color: #94A3B8;"></i>
    </span>
    <input
      type="text"
      class="form-control border-start-0 ps-0"
      placeholder="Rechercher par nom, prénom, email..."
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style scoped>
.recherche-group {
  max-width: 350px;
}
.form-control:focus {
  box-shadow: none;
  border-color: #D20C4F;
}
</style>