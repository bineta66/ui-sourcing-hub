<template>
  <div class="question-options">
    <div v-for="(option, index) in question.options" :key="index" class="option-item">
      <div class="option-radio" v-if="question.type === 'radio'">
        <span class="option-circle"></span>
      </div>
      <div class="option-checkbox" v-else-if="question.type === 'checkbox'">
        <span class="option-box"></span>
      </div>
      <div class="option-select-icon" v-else-if="question.type === 'select'">
        <i class="bi bi-caret-down-fill"></i>
      </div>
      <input
        type="text"
        class="form-control form-control-sm option-input"
        :value="option"
        @input="$emit('update-option', { sectionId, questionId: question.id, optionIndex: index, value: $event.target.value })"
        placeholder="Option"
      />
      <button
        class="btn btn-sm btn-outline-danger option-remove"
        @click="$emit('delete-option', { sectionId, questionId: question.id, optionIndex: index })"
        title="Supprimer l'option"
      >
        <i class="bi bi-x"></i>
      </button>
    </div>
    <button
      class="btn btn-outline-secondary btn-sm add-option-btn"
      title="Ajouter une option"
      @click="$emit('add-option', { sectionId, questionId: question.id, option: 'Nouvelle option' })"
    >
      <i class="bi bi-plus-lg"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  question: Object,
  sectionId: String
})

defineEmits(['add-option', 'update-option', 'delete-option'])
</script>

<style scoped>
.question-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #5f6368;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #5f6368;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-select-icon {
  color: #5f6368;
  font-size: 12px;
  flex-shrink: 0;
  width: 18px;
  text-align: center;
}

.option-input {
  flex: 1;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  padding: 6px 10px;
}

.option-input:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.option-remove {
  padding: 4px 8px;
  border-radius: 6px;
}

.add-option-btn {
  margin-top: 4px;
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
}
</style>
