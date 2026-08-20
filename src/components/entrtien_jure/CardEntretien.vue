<template>
  <div class="card-entretien" @click="$emit('click')">
    <span class="badge" :class="badgeClass">{{ typeLabel }}</span>
    <h5>{{ entretien.campagneNom }}</h5>
    <p class="candidats-count">
      <i class="fa-solid fa-users"></i>
      {{ entretien.candidatsIds.length }} candidat(s)
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ entretien: { type: Object, required: true } })
defineEmits(['click'])

const typeLabel = computed(() =>
  props.entretien.type === 'technique' ? 'Entretien technique' : 'Entretien motivation'
)
const badgeClass = computed(() =>
  props.entretien.type === 'technique' ? 'badge-technique' : 'badge-motivation'
)
</script>

<style scoped>
.card-entretien {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  transition: transform 0.15s ease;
}
.card-entretien:hover {
  transform: translateY(-2px);
}
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.badge-technique {
  background: #E6F0FF;
  color: #1D4ED8;
}
.badge-motivation {
  background: #FDE6EE;
  color: #D20C4F;
}
</style>