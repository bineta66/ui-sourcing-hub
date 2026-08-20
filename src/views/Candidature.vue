<template>
  <div class="candidature-page">
    <div class="candidature-sheet">
      <div class="candidature-header">
        <div class="candidature-brand">
          <img src="@/assets/logo.png" alt="Sourcing HUB" class="candidature-logo" />
          <span class="candidature-brand-text">Sourcing HUB</span>
        </div>
        <h1 class="candidature-title">{{ form.titre || 'Candidature' }}</h1>
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

      <div v-else-if="!form.publier || !form.actif" class="candidature-not-found">
        <i class="bi bi-exclamation-triangle fs-1 text-warning d-block mb-3"></i>
        <h2>Formulaire non disponible</h2>
        <p class="text-muted">Ce formulaire n'est pas publié ou a été désactivé.</p>
        <router-link to="/login" class="btn btn-primary">Retour à l'accueil</router-link>
      </div>

      <div v-else-if="submittedSuccessfully" class="candidature-success text-center py-5 px-4">
        <i class="bi bi-check-circle-fill text-success fs-1 d-block mb-3"></i>
        <h2 class="fw-bold text-dark-blue mb-2">Candidature envoyée avec succès !</h2>
        <p class="text-muted mb-4">
          Votre candidature a bien été enregistrée pour la campagne <strong>{{ form.campagne_title || form.titre }}</strong>.
          <br />
          Vous serez informé(e) par email des prochaines étapes et de la réunion d'information.
        </p>
        <div class="alert alert-info d-inline-block text-start">
          <i class="bi bi-info-circle me-2"></i>
          <strong>Note :</strong> Aucune création de compte n'est requise à ce stade. Votre accès sera activé ultérieurement si votre présence à la réunion d'information est validée.
        </div>
      </div>

      <div v-else class="candidature-body">
        <!-- Section Identité du candidat si le formulaire ne contient pas de question email dédiée -->
        <div v-if="!hasEmailQuestion" class="candidature-section mb-4">
          <div class="candidature-section-title">Coordonnées du candidat</div>
          <div class="candidature-section-desc">Veuillez renseigner vos coordonnées pour le traitement de votre candidature.</div>

          <div class="row g-3 mt-1">
            <div class="col-md-6">
              <label class="candidature-question-label">
                Nom <span class="required-asterisk">*</span>
              </label>
              <input
                v-model="candidateIdentity.nom"
                type="text"
                class="form-control candidature-input"
                placeholder="Votre nom"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="candidature-question-label">
                Prénom <span class="required-asterisk">*</span>
              </label>
              <input
                v-model="candidateIdentity.prenom"
                type="text"
                class="form-control candidature-input"
                placeholder="Votre prénom"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="candidature-question-label">
                Adresse e-mail <span class="required-asterisk">*</span>
              </label>
              <input
                v-model="candidateIdentity.email"
                type="email"
                class="form-control candidature-input"
                placeholder="nom.prenom@example.com"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="candidature-question-label">
                Téléphone
              </label>
              <input
                v-model="candidateIdentity.telephone"
                type="tel"
                class="form-control candidature-input"
                placeholder="+221 ..."
              />
            </div>
          </div>
        </div>

        <div v-for="section in form.sections" :key="section.id" class="candidature-section mb-4">
          <div class="candidature-section-title">{{ section.titre }}</div>
          <div v-if="section.description" class="candidature-section-desc">{{ section.description }}</div>

          <div v-for="question in section.questions" :key="question.id" class="candidature-question">
            <label class="candidature-question-label">
              {{ question.texte }}
              <span v-if="question.obligatoire" class="required-asterisk">*</span>
            </label>

            <div class="candidature-question-input">
              <input
                v-if="['TEXT', 'EMAIL', 'NUMBER', 'DATE', 'YES_NO'].includes(question.type_question)"
                :type="inputType(question.type_question)"
                class="form-control candidature-input"
                :placeholder="'Votre réponse'"
                :value="getAnswerValue(question)"
                @input="updateAnswer(question, $event.target.value)"
              />
              <textarea
                v-else-if="question.type_question === 'TEXTAREA'"
                class="form-control candidature-input"
                rows="3"
                placeholder="Votre réponse"
                :value="getAnswerValue(question)"
                @input="updateAnswer(question, $event.target.value)"
              ></textarea>
              <div v-else-if="question.type_question === 'RADIO'" class="candidature-options">
                <div v-for="(option, idx) in question.options" :key="option.id" class="candidature-option">
                  <input
                    :id="'candidature-radio-' + question.id + '-' + idx"
                    class="form-check-input"
                    type="radio"
                    :name="'candidature-radio-' + question.id"
                    :value="option.valeur"
                    :checked="getAnswerValue(question) === option.valeur"
                    @change="updateAnswer(question, option.valeur)"
                  />
                  <label :for="'candidature-radio-' + question.id + '-' + idx" class="candidature-option-label">
                    {{ option.texte }}
                  </label>
                </div>
              </div>
              <div v-else-if="question.type_question === 'CHECKBOX'" class="candidature-options">
                <div v-for="(option, idx) in question.options" :key="option.id" class="candidature-option">
                  <input
                    :id="'candidature-check-' + question.id + '-' + idx"
                    class="form-check-input"
                    type="checkbox"
                    :value="option.valeur"
                    :checked="(getAnswerValue(question) || []).includes(option.valeur)"
                    @change="toggleCheckbox(question, option.valeur)"
                  />
                  <label :for="'candidature-check-' + question.id + '-' + idx" class="candidature-option-label">
                    {{ option.texte }}
                  </label>
                </div>
              </div>
              <select v-else-if="question.type_question === 'SELECT'" class="form-select candidature-input" :value="getAnswerValue(question)" @change="updateAnswer(question, $event.target.value)">
                <option value="">Sélectionner...</option>
                <option v-for="option in question.options" :key="option.id" :value="option.valeur">
                  {{ option.texte }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div v-if="formFound && !loading && form.publier && form.actif && !submittedSuccessfully" class="candidature-footer">
        <button class="btn btn-primary candidature-submit" @click="submitForm" :disabled="submitting">
          <span v-if="!submitting">Envoyer ma candidature</span>
          <span v-else class="d-flex align-items-center gap-2">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Envoi en cours...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getFormulaireById, soumettreReponses } from '@/api/endpoints/formulaires'

const route = useRoute()

const loading = ref(true)
const formFound = ref(false)
const submitting = ref(false)
const submittedSuccessfully = ref(false)
const form = ref({})
const answers = ref({})

const candidateIdentity = reactive({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
})

const formulaireId = computed(() => route.params.id)

// Détermine si le formulaire contient déjà une question pour l'adresse email
const hasEmailQuestion = computed(() => {
  for (const section of form.value.sections || []) {
    for (const q of section.questions || []) {
      const qLower = (q.texte || '').toLowerCase()
      if (q.type_question === 'EMAIL' || qLower.includes('email') || qLower.includes('e-mail')) {
        return true
      }
    }
  }
  return false
})

const inputType = (type) => {
  const map = {
    TEXT: 'text',
    EMAIL: 'email',
    NUMBER: 'number',
    DATE: 'date',
    YES_NO: 'text',
  }
  return map[type] || 'text'
}

const getAnswerValue = (question) => {
  return answers.value[question.id] ?? ''
}

const initAnswers = (sections) => {
  const acc = {}
  sections.forEach(section => {
    section.questions.forEach(q => {
      if (q.type_question === 'CHECKBOX') {
        acc[q.id] = []
      }
    })
  })
  answers.value = acc
}

const updateAnswer = (question, value) => {
  answers.value[question.id] = value
}

const toggleCheckbox = (question, option) => {
  const current = answers.value[question.id] || []
  const next = current.includes(option)
    ? current.filter(item => item !== option)
    : [...current, option]
  answers.value[question.id] = next
}

onMounted(async () => {
  try {
    const { data } = await getFormulaireById(formulaireId.value)
    form.value = data
    formFound.value = true
    initAnswers(data.sections || [])
  } catch (err) {
    formFound.value = false
  } finally {
    loading.value = false
  }
})

/**
 * Soumission du formulaire public :
 * - Aucun JWT ni authentification requis.
 * - Crée une candidature avec le statut EN_ATTENTE liée à la campagne.
 * - Le compte utilisateur n'est PAS créé ici.
 */
const submitForm = async () => {
  if (submitting.value) return

  // Validation si les coordonnées sont saisies via la section Coordonnées
  if (!hasEmailQuestion.value) {
    if (!candidateIdentity.nom.trim() || !candidateIdentity.prenom.trim() || !candidateIdentity.email.trim()) {
      alert('Veuillez renseigner votre nom, prénom et adresse email.')
      return
    }
  }

  submitting.value = true
  try {
    const reponses = []
    let detectedEmail = candidateIdentity.email.trim()
    let detectedNom = candidateIdentity.nom.trim()
    let detectedPrenom = candidateIdentity.prenom.trim()
    let detectedTelephone = candidateIdentity.telephone.trim()

    for (const section of form.value.sections || []) {
      for (const question of section.questions || []) {
        const valeur = answers.value[question.id]
        const qLower = (question.texte || '').toLowerCase()
        const strVal = String(valeur ?? '').trim()

        if (!detectedEmail && (question.type_question === 'EMAIL' || qLower.includes('email') || qLower.includes('e-mail'))) {
          detectedEmail = strVal
        }
        if (!detectedNom && (qLower.includes('nom') && !qLower.includes('prénom') && !qLower.includes('prenom'))) {
          detectedNom = strVal
        }
        if (!detectedPrenom && (qLower.includes('prénom') || qLower.includes('prenom'))) {
          detectedPrenom = strVal
        }
        if (!detectedTelephone && (qLower.includes('téléphone') || qLower.includes('telephone') || qLower.includes('tel'))) {
          detectedTelephone = strVal
        }

        if (question.type_question === 'CHECKBOX') {
          reponses.push({
            question: question.id,
            options: Array.isArray(valeur) ? valeur.map(v => {
              const opt = question.options.find(o => o.valeur === v)
              return opt ? opt.id : null
            }).filter(Boolean) : []
          })
        } else if (question.type_question === 'RADIO' || question.type_question === 'SELECT') {
          const opt = question.options.find(o => o.valeur === valeur)
          reponses.push({
            question: question.id,
            options: opt ? [opt.id] : []
          })
        } else {
          reponses.push({
            question: question.id,
            valeur: strVal
          })
        }
      }
    }

    const payload = {
      nom: detectedNom,
      prenom: detectedPrenom,
      email: detectedEmail,
      telephone: detectedTelephone,
      reponses,
    }

    await soumettreReponses(formulaireId.value, payload)
    submittedSuccessfully.value = true
  } catch (err) {
    const errorData = err.response?.data
    if (errorData?.detail) {
      alert(errorData.detail)
    } else if (errorData?.email) {
      alert(`Email: ${Array.isArray(errorData.email) ? errorData.email.join(', ') : errorData.email}`)
    } else {
      alert('Erreur lors de l\'envoi du formulaire.')
    }
  } finally {
    submitting.value = false
  }
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

.candidature-section {
  margin-bottom: 24px;
}

.candidature-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.candidature-section-desc {
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 12px;
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
