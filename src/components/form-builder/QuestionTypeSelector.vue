<template>
  <div class="type-selector">
    <label class="type-label">Type de question</label>
    <select
      class="form-select form-select-sm type-select"
      :value="question.type"
      @change="$emit('update-question', { sectionId, questionId: question.id, type: $event.target.value })"
    >
      <option value="text">Réponse courte</option>
      <option value="textarea">Paragraphe</option>
      <option value="radio">Choix unique</option>
      <option value="checkbox">Cases à cocher</option>
      <option value="select">Liste déroulante</option>
      <option value="date">Date</option>
      <option value="time">Heure</option>
      <option value="number">Nombre</option>
      <option value="email">E-mail</option>
      <option value="tel">Téléphone</option>
      <option value="yes_no">Oui / Non</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  question: Object,
  sectionId: String
})

defineEmits(['update-question'])
</script>

<style scoped>
.type-selector {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.type-label {
  font-size: 11px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.type-select {
  max-width: 220px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 6px 12px;
  background: #f8f9fa;
  cursor: pointer;
}

.type-select:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}
</style>
