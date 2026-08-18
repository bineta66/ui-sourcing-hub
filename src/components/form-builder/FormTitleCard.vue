<template>
  <div class="form-title-card" @click="$emit('click')">
    <h1 class="form-main-title">
      {{ title || 'Formulaire sans titre' }}
    </h1>
    <p v-if="description" class="form-main-description">
      {{ description }}
    </p>
    <div class="purple-indicator"></div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String
})

defineEmits(['click'])
</script>

<style scoped>
.form-title-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: box-shadow 0.15s;
}

.form-title-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.form-main-title {
  font-size: 22px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.form-main-description {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
}

.purple-indicator {
  width: 100%;
  height: 4px;
  background: #7c3aed;
  border-radius: 2px;
  margin-top: 20px;
}
</style>
