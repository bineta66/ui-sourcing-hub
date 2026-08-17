<template>
  <div class="question-editor">
    <div class="editor-row">
      <label class="editor-label">Type de question</label>
      <select
        class="form-select form-select-sm"
        :value="question.type"
        @change="$emit('update-question', { sectionId, questionId: question.id, type: $event.target.value })"
      >
        <option value="text">Texte court</option>
        <option value="textarea">Texte long</option>
        <option value="radio">Choix unique</option>
        <option value="checkbox">Cases à cocher</option>
        <option value="select">Liste déroulante</option>
        <option value="date">Date</option>
        <option value="number">Nombre</option>
        <option value="email">E-mail</option>
        <option value="tel">Téléphone</option>
      </select>
    </div>

    <div class="editor-row" v-if="hasOptions">
      <label class="editor-label">Options</label>
      <div class="options-list">
        <div v-for="(option, index) in question.options" :key="index" class="option-item">
          <input
            type="text"
            class="form-control form-control-sm"
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
          class="btn btn-outline-secondary btn-sm mt-2"
          title="Ajouter une option"
          @click="addOption"
        >
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormBuilderStore } from '@/stores/formBuilder'

const props = defineProps({
  question: Object,
  sectionId: String
})

const emit = defineEmits([
  'update-question',
  'add-option',
  'update-option',
  'delete-option'
])

const store = useFormBuilderStore()

const hasOptions = computed(() => ['radio', 'checkbox', 'select'].includes(props.question.type))

const addOption = () => {
  emit('add-option', {
    sectionId: props.sectionId,
    questionId: props.question.id,
    option: 'Nouvelle option'
  })
}
</script>

<style scoped>
.question-editor {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.editor-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.editor-label {
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.option-item input {
  flex: 1;
}

.option-remove {
  padding: 4px 8px;
}
</style>
