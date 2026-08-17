<template>
  <div
    class="form-question"
    :class="{ 'is-selected': isSelected }"
    @click.stop="$emit('select-question', question.id)"
  >
    <div class="question-card">
      <div class="question-main">
        <div class="question-header-row">
          <div class="question-title-group">
            <i class="bi bi-grip-vertical question-grip"></i>
            <input
              v-model="localLabel"
              class="question-label-input"
              placeholder="Question sans titre"
              @input="$emit('update-question', { sectionId, questionId: question.id, label: localLabel })"
            />
          </div>
          <div class="question-actions-row">
            <button class="icon-btn-sm" title="Monter" @click.stop="$emit('move-question', { sectionId, questionId: question.id, direction: -1 })" :disabled="questionIndex === 0">
              <i class="bi bi-arrow-up"></i>
            </button>
            <button class="icon-btn-sm" title="Descendre" @click.stop="$emit('move-question', { sectionId, questionId: question.id, direction: 1 })" :disabled="questionIndex === totalQuestions - 1">
              <i class="bi bi-arrow-down"></i>
            </button>
            <button class="icon-btn-sm" title="Dupliquer" @click.stop="$emit('duplicate-question', { sectionId, questionId: question.id })">
              <i class="bi bi-copy"></i>
            </button>
            <button class="icon-btn-sm text-danger" title="Supprimer" @click.stop="$emit('delete-question', { sectionId, questionId: question.id })">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <div class="question-type-row">
          <QuestionTypeSelector
            :question="question"
            :section-id="sectionId"
            @update-question="$emit('update-question', $event)"
          />
        </div>

        <div v-if="hasOptions" class="question-options-row">
          <QuestionOptions
            :question="question"
            :section-id="sectionId"
            @add-option="$emit('add-option', $event)"
            @update-option="$emit('update-option', $event)"
            @delete-option="$emit('delete-option', $event)"
          />
        </div>
      </div>

      <div class="question-footer">
        <label class="required-toggle">
          <span class="required-label">Obligatoire</span>
          <input
            type="checkbox"
            :checked="question.required"
            @change="$emit('update-question', { sectionId, questionId: question.id, required: $event.target.checked })"
          />
          <span class="toggle-slider"></span>
        </label>
        <button class="icon-btn-sm more-btn" title="Plus d'options">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import QuestionTypeSelector from './QuestionTypeSelector.vue'
import QuestionOptions from './QuestionOptions.vue'

const props = defineProps({
  question: Object,
  sectionId: String,
  sectionIndex: Number,
  questionIndex: Number,
  totalQuestions: Number,
  isSelected: Boolean
})

const emit = defineEmits([
  'update-question',
  'delete-question',
  'move-question',
  'duplicate-question',
  'add-option',
  'update-option',
  'delete-option',
  'select-question'
])

const localLabel = ref(props.question.label)

watch(() => props.question.label, (val) => {
  if (val !== localLabel.value) localLabel.value = val
})

const hasOptions = computed(() => ['radio', 'checkbox', 'select'].includes(props.question.type))
</script>

<style scoped>
.form-question {
  margin-bottom: 12px;
  padding: 0 16px;
}

.form-question.is-selected .question-card {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
}

.question-card {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background: #ffffff;
  overflow: hidden;
  transition: all 0.15s;
}

.question-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.question-main {
  padding: 16px;
}

.question-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.question-title-group {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.question-grip {
  color: #adb5bd;
  cursor: grab;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 4px;
}

.question-label-input {
  border: 1px solid transparent;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  padding: 4px 8px;
  border-radius: 6px;
  flex: 1;
  min-width: 0;
  line-height: 1.4;
}

.question-label-input:focus {
  outline: none;
  border-color: #7c3aed;
  background: #fff;
}

.question-actions-row {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.question-type-row {
  margin-left: 30px;
  margin-bottom: 12px;
}

.question-options-row {
  margin-left: 30px;
}

.question-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-top: 1px solid #f1f3f5;
  background: #fafbfc;
}

.required-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #5f6368;
  user-select: none;
}

.required-toggle input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 36px;
  height: 20px;
  background: #dadce0;
  border-radius: 20px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.toggle-slider::before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background: #ffffff;
  border-radius: 50%;
  transition: 0.2s;
}

.required-toggle input:checked + .toggle-slider {
  background: #7c3aed;
}

.required-toggle input:checked + .toggle-slider::before {
  transform: translateX(16px);
}

.more-btn {
  color: #5f6368;
}
</style>
