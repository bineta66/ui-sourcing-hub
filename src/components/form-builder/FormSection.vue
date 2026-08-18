<template>
  <div class="form-section" :data-section-id="section.id">
    <div class="section-header-bar">
      <div class="section-header-left">
        <i class="bi bi-grip-vertical section-grip"></i>
        <input
          v-model="localTitle"
          class="section-title-input"
          placeholder="Titre de la section"
          @input="$emit('update-section', { id: section.id, title: localTitle })"
        />
      </div>
      <div class="section-header-actions">
        <button class="icon-btn-sm" title="Monter" @click="$emit('move-section', { id: section.id, direction: -1 })" :disabled="sectionIndex === 0">
          <i class="bi bi-arrow-up"></i>
        </button>
        <button class="icon-btn-sm" title="Descendre" @click="$emit('move-section', { id: section.id, direction: 1 })" :disabled="sectionIndex === totalSections - 1">
          <i class="bi bi-arrow-down"></i>
        </button>
        <button class="icon-btn-sm" title="Dupliquer la section" @click="$emit('duplicate-section', section.id)">
          <i class="bi bi-copy"></i>
        </button>
        <button class="icon-btn-sm text-danger" title="Supprimer la section" @click="$emit('delete-section', section.id)">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>

    <div class="section-questions">
      <FormQuestion
        v-for="(question, questionIndex) in section.questions"
        :key="question.id"
        :question="question"
        :section-id="section.id"
        :section-index="sectionIndex"
        :question-index="questionIndex"
        :total-questions="section.questions.length"
        :is-selected="selectedQuestionId === question.id"
        @update-question="$emit('update-question', $event)"
        @delete-question="$emit('delete-question', $event)"
        @move-question="$emit('move-question', $event)"
        @duplicate-question="$emit('duplicate-question', $event)"
        @add-option="$emit('add-option', $event)"
        @update-option="$emit('update-option', $event)"
        @delete-option="$emit('delete-option', $event)"
        @select-question="$emit('select-question', $event)"
      />

      <div v-if="section.questions.length === 0" class="empty-section-hint">
        <p class="text-muted mb-2">Cette section ne contient aucune question.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormQuestion from './FormQuestion.vue'

const props = defineProps({
  section: Object,
  sectionIndex: Number,
  totalSections: Number,
  selectedQuestionId: String
})

const emit = defineEmits([
  'update-section',
  'delete-section',
  'move-section',
  'duplicate-section',
  'add-question',
  'update-question',
  'delete-question',
  'move-question',
  'duplicate-question',
  'add-option',
  'update-option',
  'delete-option',
  'select-question'
])

const localTitle = ref(props.section.title)
</script>

<style scoped>
.form-section {
  margin-bottom: 16px;
}

.section-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  gap: 12px;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.section-grip {
  color: #adb5bd;
  cursor: grab;
  font-size: 16px;
  flex-shrink: 0;
}

.section-title-input {
  border: 1px solid transparent;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
  color: #212529;
  padding: 4px 8px;
  border-radius: 6px;
  flex: 1;
  min-width: 0;
}

.section-title-input:focus {
  outline: none;
  border-color: #7c3aed;
  background: #fff;
}

.section-header-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.section-questions {
  border: 1px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 10px 10px;
  background: #ffffff;
  padding: 8px 0;
}

.empty-section-hint {
  text-align: center;
  padding: 24px 16px;
}

.icon-btn-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #5f6368;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.icon-btn-sm:hover:not(:disabled) {
  background: #e9ecef;
  color: #202124;
}

.icon-btn-sm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
