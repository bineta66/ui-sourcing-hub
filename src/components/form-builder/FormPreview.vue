<template>
  <div v-if="modelValue" class="preview-overlay" @click.self="close">
    <div class="preview-container">
      <div class="preview-sheet">
        <div class="preview-header">
          <div class="preview-title-block">
            <h1 class="preview-title">{{ formTitle || 'Formulaire sans titre' }}</h1>
            <p v-if="formDescription" class="preview-desc">{{ formDescription }}</p>
          </div>
          <button class="preview-close-btn" @click="close" title="Fermer">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="preview-body">
          <div v-for="section in sections" :key="section.id" class="preview-section">
            <div class="preview-section-header">
              <h2 class="preview-section-title">{{ section.title }}</h2>
            </div>

            <div class="preview-section-body">
              <div v-for="question in section.questions" :key="question.id" class="preview-question">
                <label class="preview-question-label">
                  {{ question.label }}
                  <span v-if="question.required" class="required-asterisk">*</span>
                </label>
                <div class="preview-question-input">
                  <input
                    v-if="['text', 'email', 'tel', 'number', 'date', 'time', 'yes_no'].includes(question.type)"
                    :type="question.type === 'yes_no' ? 'text' : question.type"
                    class="form-control preview-input"
                    :placeholder="'Votre ' + (question.type === 'text' ? 'réponse' : question.type)"
                  />
                  <textarea
                    v-else-if="question.type === 'textarea'"
                    class="form-control preview-input"
                    rows="3"
                    placeholder="Votre réponse"
                  ></textarea>
                  <div v-else-if="question.type === 'radio'" class="preview-options">
                    <div v-for="(option, idx) in question.options" :key="idx" class="preview-option">
                      <input
                        :id="'preview-radio-' + question.id + '-' + idx"
                        class="form-check-input"
                        type="radio"
                        :name="'preview-radio-' + question.id"
                      />
                      <label :for="'preview-radio-' + question.id + '-' + idx" class="preview-option-label">
                        {{ option }}
                      </label>
                    </div>
                  </div>
                  <div v-else-if="question.type === 'checkbox'" class="preview-options">
                    <div v-for="(option, idx) in question.options" :key="idx" class="preview-option">
                      <input
                        :id="'preview-check-' + question.id + '-' + idx"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label :for="'preview-check-' + question.id + '-' + idx" class="preview-option-label">
                        {{ option }}
                      </label>
                    </div>
                  </div>
                  <select v-else-if="question.type === 'select'" class="form-select preview-input">
                    <option value="">Sélectionner...</option>
                    <option v-for="(option, idx) in question.options" :key="idx" :value="option">
                      {{ option }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div v-if="sections.length === 0" class="preview-empty">
            <p class="text-muted">Aucune question dans ce formulaire.</p>
          </div>

          <div class="preview-footer">
            <button class="btn btn-primary preview-submit" @click="submitPreview">
              <i class="bi bi-send"></i> Soumettre
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormBuilderStore } from '@/stores/formBuilder'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const store = useFormBuilderStore()
const formTitle = computed(() => store.formTitle)
const formDescription = computed(() => store.formDescription)
const sections = computed(() => store.sections)

const close = () => {
  emit('update:modelValue', false)
}

const submitPreview = () => {
  alert('Formulaire soumis avec succès ! (aperçu)')
}
</script>

<style scoped>
.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
  z-index: 1055;
  overflow-y: auto;
}

.preview-container {
  width: 100%;
  max-width: 720px;
}

.preview-sheet {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 32px 32px 0;
}

.preview-title-block {
  flex: 1;
  min-width: 0;
}

.preview-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
  line-height: 1.3;
}

.preview-desc {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
}

.preview-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.preview-close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.preview-body {
  padding: 28px 32px 32px;
}

.preview-section {
  margin-bottom: 24px;
}

.preview-section:last-child {
  margin-bottom: 0;
}

.preview-section-header {
  margin-bottom: 18px;
}

.preview-section-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.preview-section-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.preview-question {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-question-label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.required-asterisk {
  color: #dc2626;
  margin-left: 2px;
}

.preview-question-input {
  width: 100%;
  max-width: 100%;
}

.preview-input {
  max-width: 100%;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  font-size: 14px;
  background: #ffffff;
  color: #111827;
}

.preview-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  outline: none;
}

.preview-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-option-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.preview-empty {
  text-align: center;
  padding: 40px 20px;
}

.preview-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.preview-submit {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  background: #7c3aed;
  border: none;
  color: #ffffff;
  cursor: pointer;
  opacity: 1;
  transition: all 0.15s;
}

.preview-submit:hover {
  background: #6d28d9;
}

@media (max-width: 576px) {
  .preview-overlay {
    padding: 0;
  }
  .preview-header,
  .preview-body {
    padding-left: 20px;
    padding-right: 20px;
  }
  .preview-title {
    font-size: 20px;
  }
}
</style>
