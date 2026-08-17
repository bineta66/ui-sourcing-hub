<template>
  <div class="candidature-page">
    <div class="candidature-sheet">
      <div class="candidature-header">
        <div class="candidature-brand">
          <img src="@/assets/logo.png" alt="Sourcing HUB" class="candidature-logo" />
          <span class="candidature-brand-text">Sourcing HUB</span>
        </div>
        <h1 class="candidature-title">{{ form.title || 'Candidature' }}</h1>
        <p v-if="form.description" class="candidature-desc">{{ form.description }}</p>
      </div>

      <div v-if="loading" class="candidature-loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2 text-muted">Chargement du formulaire...</p>
      </div>

      <div v-else-if="!formFound" class="candidature-not-found">
        <i class="bi bi-exclamation-triangle fs-1 text-warning d-block mb-3"></i>
        <h2>Formulaire introuvable</h2>
        <p class="text-muted">Ce formulaire de candidature n'existe pas ou n'est plus disponible.</p>
        <router-link to="/login" class="btn btn-primary">Retour à l'accueil</router-link>
      </div>

      <div v-else class="candidature-body">
        <div v-for="question in form.questions" :key="question.id" class="candidature-question">
          <label class="candidature-question-label">
            {{ question.label }}
            <span v-if="question.required" class="required-asterisk">*</span>
          </label>

          <div class="candidature-question-input">
            <input
              v-if="['text', 'email', 'tel', 'number', 'date', 'time'].includes(question.type)"
              :type="question.type"
              class="form-control candidature-input"
              :placeholder="'Votre ' + (question.type === 'text' ? 'réponse' : question.type)"
              :value="answers[question.id]"
              @input="updateAnswer(question.id, $event.target.value)"
            />
            <textarea
              v-else-if="question.type === 'textarea'"
              class="form-control candidature-input"
              rows="3"
              placeholder="Votre réponse"
              :value="answers[question.id]"
              @input="updateAnswer(question.id, $event.target.value)"
            ></textarea>
            <div v-else-if="question.type === 'radio'" class="candidature-options">
              <div v-for="(option, idx) in question.options" :key="idx" class="candidature-option">
                <input
                  :id="'candidature-radio-' + question.id + '-' + idx"
                  class="form-check-input"
                  type="radio"
                  :name="'candidature-radio-' + question.id"
                  :value="option"
                  :checked="answers[question.id] === option"
                  @change="updateAnswer(question.id, option)"
                />
                <label :for="'candidature-radio-' + question.id + '-' + idx" class="candidature-option-label">
                  {{ option }}
                </label>
              </div>
            </div>
            <div v-else-if="question.type === 'checkbox'" class="candidature-options">
              <div v-for="(option, idx) in question.options" :key="idx" class="candidature-option">
                <input
                  :id="'candidature-check-' + question.id + '-' + idx"
                  class="form-check-input"
                  type="checkbox"
                  :value="option"
                  :checked="(answers[question.id] || []).includes(option)"
                  @change="toggleCheckbox(question.id, option)"
                />
                <label :for="'candidature-check-' + question.id + '-' + idx" class="candidature-option-label">
                  {{ option }}
                </label>
              </div>
            </div>
            <select v-else-if="question.type === 'select'" class="form-select candidature-input" :value="answers[question.id]" @change="updateAnswer(question.id, $event.target.value)">
              <option value="">Sélectionner...</option>
              <option v-for="(option, idx) in question.options" :key="idx" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="formFound && !loading" class="candidature-footer">
        <button class="btn btn-primary candidature-submit" @click="submitForm" :disabled="submitting">
          <span v-if="!submitting">Envoyer ma candidature</span>
          <span v-else class="d-flex align-items-center gap-2">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Envoi...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFormBuilderStore } from '@/stores/formBuilder'

const route = useRoute()
const store = useFormBuilderStore()

const loading = ref(true)
const formFound = ref(false)
const submitting = ref(false)
const form = ref({})
const answers = ref({})

const slug = computed(() => route.params.slug)

const initAnswers = (questions) => {
  const acc = {}
  questions.forEach(q => {
    if (q.type === 'checkbox') {
      acc[q.id] = []
    }
  })
  answers.value = acc
}

const updateAnswer = (questionId, value) => {
  answers.value[questionId] = value
}

const toggleCheckbox = (questionId, option) => {
  const current = answers.value[questionId] || []
  const next = current.includes(option)
    ? current.filter(item => item !== option)
    : [...current, option]
  answers.value[questionId] = next
}

onMounted(() => {
  const data = store.getPublishedFormBySlug(slug.value)
  if (data && data.questions && data.questions.length) {
    formFound.value = true
    form.value = data
    initAnswers(data.questions)
  }
  loading.value = false
})

const submitForm = () => {
  if (submitting.value) return
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    alert('Votre candidature a été enregistrée avec succès.')
    initAnswers(form.value.questions)
  }, 800)
}
</script>

<style scoped>
.candidature-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
}

.candidature-sheet {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 720px;
  overflow: hidden;
}

.candidature-header {
  padding: 32px 32px 0;
}

.candidature-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.candidature-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.candidature-brand-text {
  font-size: 16px;
  font-weight: 800;
  color: #D20C4F;
  letter-spacing: -0.02em;
}

.candidature-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
  line-height: 1.3;
}

.candidature-desc {
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 4px;
  line-height: 1.5;
}

.candidature-loading,
.candidature-not-found {
  text-align: center;
  padding: 60px 20px;
}

.candidature-body {
  padding: 28px 32px 0;
}

.candidature-question {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.candidature-question:last-child {
  margin-bottom: 0;
}

.candidature-question-label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.required-asterisk {
  color: #dc2626;
  margin-left: 2px;
}

.candidature-question-input {
  width: 100%;
}

.candidature-input {
  max-width: 100%;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  font-size: 14px;
  background: #ffffff;
  color: #111827;
}

.candidature-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  outline: none;
}

.candidature-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.candidature-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.candidature-option-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.candidature-footer {
  padding: 20px 32px 28px;
  display: flex;
  justify-content: flex-end;
}

.candidature-submit {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  background: #7c3aed;
  border: none;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.15s;
}

.candidature-submit:hover:not(:disabled) {
  background: #6d28d9;
}

.candidature-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 576px) {
  .candidature-page {
    padding: 0;
  }
  .candidature-header,
  .candidature-body,
  .candidature-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  .candidature-title {
    font-size: 20px;
  }
}
</style>
