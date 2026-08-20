<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useEntretiensStore } from '@/stores/entretiens'
import { useAuthStore } from '@/stores/auth'
import { createCandidature } from '@/api/endpoints/candidatures'
import AddParticipantModal from '@/components/entretiens/AddParticipantModal.vue'

const router = useRouter()
const store = useEntretiensStore()
const authStore = useAuthStore()

// Étape du Stepper (1: Details, 2: Planification, 3: Confirmation)
const currentStep = ref(1)

const todayDate = new Date().toISOString().split('T')[0]
const formattedTodayDate = new Date().toLocaleDateString('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

// Formulaire
const form = ref({
  campagneId: null,
  program: '',
  type: 'Technique', // 'Technique' | 'Motivation' | 'Final'
  date: todayDate,
  time: '09:00',
  duration: '45 Minutes',
  lieu: 'Simplon Sénégal',
  lien_visio: 'https://meet.google.com/session-entretiens',
  notes: ''
})

// Message d'erreur
const errorMessage = ref('')

// Modale pour ajouter un participant
const showAddModal = ref(false)
const addModalType = ref('recruiter') // 'recruiter' | 'candidate'

// État de soumission
const isSaving = ref(false)

onMounted(async () => {
  const camps = await store.fetchCampagnes()
  await store.fetchRecruiters()
  if (camps && camps.length > 0) {
    form.value.campagneId = camps[0].id
    form.value.program = camps[0].title
    await store.fetchCandidates(camps[0].id)
  }
})

const onCampagneChange = async () => {
  const selected = store.campagnes.find(c => c.id === form.value.campagneId)
  if (selected) {
    form.value.program = selected.title
    await store.fetchCandidates(selected.id)
  } else {
    store.availableCandidates = []
  }
}

// Navigation du stepper
const setStep = (step) => {
  errorMessage.value = ''
  if (step <= currentStep.value || step === currentStep.value + 1) {
    currentStep.value = step
  }
}

const openAddRecruiter = () => {
  addModalType.value = 'recruiter'
  showAddModal.value = true
}

const openAddCandidate = () => {
  addModalType.value = 'candidate'
  showAddModal.value = true
}

const handleParticipantAdded = async (participant) => {
  if (participant.type === 'recruiter') {
    store.addRecruiter(participant)
  } else {
    try {
      if (form.value.campagneId) {
        await createCandidature({
          campagne: form.value.campagneId,
          nom: participant.nom || 'Candidat',
          prenom: participant.prenom || participant.name,
          email: participant.email,
          telephone: participant.telephone || ''
        })
        await store.fetchCandidates(form.value.campagneId)
      } else {
        store.addCandidate(participant)
      }
    } catch (err) {
      console.warn('Création API directe échouée, fallback local:', err)
      store.addCandidate(participant)
    }
  }
}

// Planifier et confirmer l'entretien
const submitEntretien = async () => {
  errorMessage.value = ''

  if (store.selectedRecruiters.length === 0) {
    errorMessage.value = 'Veuillez affecter au moins un membre du jury.'
    currentStep.value = 2
    return
  }

  if (store.selectedCandidates.length === 0) {
    errorMessage.value = 'Veuillez sélectionner au moins un candidat pour cette session.'
    currentStep.value = 2
    return
  }

  isSaving.value = true

  try {
    await store.createAndConfirmEntretien({
      campagneId: form.value.campagneId,
      program: form.value.program,
      type: form.value.type,
      date: form.value.date,
      time: form.value.time,
      duration: form.value.duration,
      lieu: form.value.lieu,
      lien_visio: form.value.lien_visio,
      notes: form.value.notes
    })

    router.push('/entretiens')
  } catch (err) {
    console.error('Erreur confirmation entretien:', err)
    errorMessage.value = err.message || 'Une erreur est survenue lors de la confirmation.'
  } finally {
    isSaving.value = false
  }
}

const handleQuickPlan = () => {
  currentStep.value = 3
}
</script>

<template>
  <div class="layout">
    <!-- Sidebar Navigation -->
    <Sidebar active-view="entretien" />

    <!-- Main Content Area -->
    <main class="main">
      <!-- Topbar Header -->
      <header class="topbar">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input
            type="text"
            placeholder="Rechercher des candidats, des entretiens ou des tâches..."
          />
        </div>

        <div class="header-actions">
          <span class="header-date">{{ formattedTodayDate }}</span>

          <button class="icon-btn notification-btn" title="Notifications">
            <i class="bi bi-bell"></i>
            <span class="notification-dot"></span>
          </button>

          <div class="user-pill">
            <div class="avatar">
              <img
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.displayName)}&background=D20C4F&color=fff&size=32`"
                :alt="authStore.displayName"
              />
            </div>
            <div class="user-meta">
              <span class="user-name">{{ authStore.displayName }}</span>
              <span class="user-role">{{ authStore.userRole || 'Administrateur' }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Page Content -->
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Planifier un nouvel entretien</h1>
            <p class="page-subtitle">
              Configurez les informations et invitez les participants à cette phase du recrutement.
            </p>
          </div>
          <div class="draft-status">
            <span>Brouillon enregistré il y a 2 min</span>
            <span class="green-dot"></span>
          </div>
        </div>

        <!-- 3-Step Stepper Component -->
        <div class="stepper-wrapper">
          <div class="stepper-container">
            <!-- Step 1 -->
            <div
              class="step-item"
              :class="{ active: currentStep === 1, completed: currentStep > 1 }"
              @click="setStep(1)"
            >
              <div class="step-circle">
                <span v-if="currentStep <= 1">1</span>
                <i v-else class="bi bi-check-lg"></i>
              </div>
              <span class="step-label">Details</span>
            </div>

            <!-- Step Line 1-2 -->
            <div
              class="step-line"
              :class="{ completed: currentStep >= 2 }"
            ></div>

            <!-- Step 2 -->
            <div
              class="step-item"
              :class="{ active: currentStep === 2, completed: currentStep > 2 }"
              @click="setStep(2)"
            >
              <div class="step-circle">
                <span v-if="currentStep <= 2">2</span>
                <i v-else class="bi bi-check-lg"></i>
              </div>
              <span class="step-label">Planification</span>
            </div>

            <!-- Step Line 2-3 -->
            <div
              class="step-line"
              :class="{ completed: currentStep >= 3 }"
            ></div>

            <!-- Step 3 -->
            <div
              class="step-item"
              :class="{ active: currentStep === 3 }"
              @click="setStep(3)"
            >
              <div class="step-circle">
                <span>3</span>
              </div>
              <span class="step-label">Confirmation</span>
            </div>
          </div>
        </div>

        <!-- Stepper Step 1 & 2 Form Layout (Main 2 Columns Card) -->
        <div v-if="currentStep === 1 || currentStep === 2" class="form-main-card">
          <!-- Alert error banner if validation failed -->
          <div v-if="errorMessage" class="alert-error-banner mb-3">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <div class="form-grid-layout">
            <!-- Left Column: Form Details -->
            <div class="left-form-column">
              <!-- Field 1: Programme / Campagne -->
              <div class="form-field-group">
                <label class="field-label">Programme / Campagne</label>
                <div class="custom-select-wrapper">
                  <select v-model="form.campagneId" @change="onCampagneChange" class="form-select-control">
                    <option v-for="c in store.campagnes" :key="c.id" :value="c.id">{{ c.title }}</option>
                    <option v-if="!store.campagnes || store.campagnes.length === 0" :value="null">Aucune campagne disponible</option>
                  </select>
                  <i class="bi bi-chevron-down field-arrow"></i>
                </div>
              </div>

              <!-- Field 2: Type d'entretien (Segmented Pills) -->
              <div class="form-field-group">
                <label class="field-label">Type d'entretien</label>
                <div class="segmented-control">
                  <button
                    type="button"
                    class="segment-btn"
                    :class="{ active: form.type === 'Technique' }"
                    @click="form.type = 'Technique'"
                  >
                    Technique
                  </button>
                  <button
                    type="button"
                    class="segment-btn"
                    :class="{ active: form.type === 'Motivation' }"
                    @click="form.type = 'Motivation'"
                  >
                    Motivation
                  </button>
                  <button
                    type="button"
                    class="segment-btn"
                    :class="{ active: form.type === 'Final' }"
                    @click="form.type = 'Final'"
                  >
                    Final
                  </button>
                </div>
              </div>

              <!-- Field 3: Date, Heure, Duration (3 inline columns) -->
              <div class="inline-triplet-grid">
                <!-- Date -->
                <div class="triplet-item">
                  <label class="field-label">Date</label>
                  <div class="input-icon-wrapper">
                    <i class="bi bi-calendar3 input-leading-icon"></i>
                    <input
                      v-model="form.date"
                      type="date"
                      class="triplet-input"
                    />
                  </div>
                </div>

                <!-- Heure -->
                <div class="triplet-item">
                  <label class="field-label">Heure</label>
                  <div class="input-icon-wrapper">
                    <i class="bi bi-clock input-leading-icon"></i>
                    <input
                      v-model="form.time"
                      type="time"
                      class="triplet-input"
                    />
                  </div>
                </div>

                <!-- Duration -->
                <div class="triplet-item">
                  <label class="field-label">Duration</label>
                  <div class="input-icon-wrapper">
                    <i class="bi bi-hourglass-split input-leading-icon"></i>
                    <input
                      v-model="form.duration"
                      type="text"
                      class="triplet-input"
                      placeholder="45 Minutes"
                    />
                  </div>
                </div>
              </div>

              <!-- Field 4: Notes de l'entretien -->
              <div class="form-field-group">
                <label class="field-label">Notes de l'entretien</label>
                <div class="textarea-wrapper">
                  <textarea
                    v-model="form.notes"
                    class="form-textarea-control"
                    rows="4"
                    placeholder="« Mentionnez les compétences techniques spécifiques ou les aspects culturels à évaluer... »"
                  ></textarea>
                </div>
              </div>

              <!-- Field 5: Bottom Dashed + Planifier Button -->
              <div class="dashed-action-wrapper">
                <button
                  type="button"
                  class="btn-dashed-planifier"
                  :disabled="isSaving"
                  @click="handleQuickPlan"
                >
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                  <span v-else class="d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-plus-lg"></i>
                    <span>Planifier</span>
                  </span>
                </button>
              </div>
            </div>

            <!-- Right Column: Recruiters & Candidates Lists -->
            <div class="right-selection-column">
              <!-- Section 1: ÉQUIPE DES RECRUTEURS -->
              <div class="selection-section">
                <h4 class="selection-section-header">ÉQUIPE DES RECRUTEURS</h4>

                <div v-if="store.loadingRecruiters" class="text-center py-3 text-muted">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  <span>Chargement des jurys...</span>
                </div>

                <div v-else-if="store.availableRecruiters.length === 0" class="card border-0 bg-light p-3 text-center text-muted small rounded-3 mb-2">
                  <i class="bi bi-person-x fs-5 d-block mb-1 text-secondary"></i>
                  <span>Aucun membre du jury disponible.</span>
                </div>

                <div v-else class="person-cards-list">
                  <div
                    v-for="recruiter in store.availableRecruiters"
                    :key="recruiter.id"
                    class="person-select-card"
                    :class="{ selected: recruiter.selected }"
                    @click="store.toggleRecruiterSelection(recruiter.id)"
                  >
                    <img
                      :src="recruiter.avatar"
                      :alt="recruiter.name"
                      class="person-avatar"
                    />
                    <div class="person-meta">
                      <span class="person-name">{{ recruiter.name }}</span>
                      <span class="person-role">{{ recruiter.role }}</span>
                    </div>
                    <div
                      class="toggle-status-icon"
                      :class="recruiter.selected ? 'checked' : 'unchecked'"
                    >
                      <i :class="recruiter.selected ? 'bi bi-check-circle-fill' : 'bi bi-plus-circle'"></i>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="btn-dashed-add-participant"
                  @click="openAddRecruiter"
                >
                  <i class="bi bi-plus"></i>
                  <span>Ajouter un recruteur</span>
                </button>
              </div>

              <!-- Section 2: LES CANDIDATS -->
              <div class="selection-section mt-4">
                <h4 class="selection-section-header">LES CANDIDATS</h4>

                <div v-if="store.loadingCandidates" class="text-center py-3 text-muted">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  <span>Chargement des candidats...</span>
                </div>

                <div v-else-if="store.availableCandidates.length === 0" class="card border-0 bg-light p-3 text-center text-muted small rounded-3 mb-2">
                  <i class="bi bi-people fs-5 d-block mb-1 text-secondary"></i>
                  <span>Aucun candidat enregistré pour cette campagne.</span>
                </div>

                <div v-else class="person-cards-list">
                  <div
                    v-for="candidate in store.availableCandidates"
                    :key="candidate.id"
                    class="person-select-card"
                    :class="{ selected: candidate.selected }"
                    @click="store.toggleCandidateSelection(candidate.id)"
                  >
                    <img
                      :src="candidate.avatar"
                      :alt="candidate.name"
                      class="person-avatar"
                    />
                    <div class="person-meta">
                      <span class="person-name">{{ candidate.name }}</span>
                      <span class="person-role">{{ candidate.role }}</span>
                    </div>
                    <div
                      class="toggle-status-icon"
                      :class="candidate.selected ? 'checked' : 'unchecked'"
                    >
                      <i :class="candidate.selected ? 'bi bi-check-circle-fill' : 'bi bi-plus-circle'"></i>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="btn-dashed-add-participant"
                  @click="openAddCandidate"
                >
                  <i class="bi bi-plus"></i>
                  <span>Ajouter un candidat</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Confirmation Step Screen -->
        <div v-else class="confirmation-screen-card">
          <div class="confirmation-header">
            <div class="confirm-icon-box">
              <i class="bi bi-calendar-check-fill"></i>
            </div>
            <h2 class="confirm-title">Récapitulatif de la session</h2>
            <p class="confirm-subtitle">
              Vérifiez toutes les informations avant de valider la convocation officielle.
            </p>
          </div>

          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Programme</span>
              <span class="summary-value">{{ form.program }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Type d'entretien</span>
              <span class="summary-badge">{{ form.type }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Date & Horaire</span>
              <span class="summary-value">{{ form.date }} à {{ form.time }} ({{ form.duration }})</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Recruteurs assignés</span>
              <div class="d-flex align-items-center gap-2 mt-1">
                <span
                  v-for="r in store.selectedRecruiters"
                  :key="r.id"
                  class="selected-pill-badge"
                >
                  <img :src="r.avatar" class="mini-avatar" />
                  {{ r.name }}
                </span>
                <span v-if="store.selectedRecruiters.length === 0" class="text-muted small">Aucun recruteur</span>
              </div>
            </div>
            <div class="summary-item">
              <span class="summary-label">Candidats convoqués</span>
              <div class="d-flex align-items-center gap-2 mt-1">
                <span
                  v-for="c in store.selectedCandidates"
                  :key="c.id"
                  class="selected-pill-badge"
                >
                  <img :src="c.avatar" class="mini-avatar" />
                  {{ c.name }}
                </span>
                <span v-if="store.selectedCandidates.length === 0" class="text-muted small">Aucun candidat</span>
              </div>
            </div>
          </div>

          <div class="confirmation-actions">
            <button class="btn-step-back" @click="currentStep = 1">
              <i class="bi bi-arrow-left"></i> Modifier les détails
            </button>
            <button
              class="btn-step-confirm"
              :disabled="isSaving"
              @click="submitEntretien"
            >
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
              <span v-else><i class="bi bi-send-check me-2"></i>Confirmer et envoyer les convocations</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal pour ajouter un recruteur ou un candidat -->
    <AddParticipantModal
      :show="showAddModal"
      :type="addModalType"
      @close="showAddModal = false"
      @add="handleParticipantAdded"
    />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  background: #F8FAFC;
}

.main {
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #FAFAFA;
  overflow-x: hidden;
}

/* ============================================================
   TOPBAR
============================================================ */
.topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 2rem;
  background: #FFFFFF;
  border-bottom: 1px solid #EEF2F6;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 440px;
  padding: 8px 16px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: #00313C;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(0, 49, 60, 0.08);
}

.search-box i {
  color: #94A3B8;
  font-size: 14px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #0F172A;
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-date {
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
}

.notification-btn {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  color: #64748B;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.notification-btn:hover {
  background: #F8FAFC;
  color: #0F172A;
}

.notification-dot {
  position: absolute;
  top: 9px;
  right: 10px;
  width: 7px;
  height: 7px;
  background: #D20C4F;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-pill .avatar img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: #94A3B8;
}

/* ============================================================
   PAGE CONTENT
============================================================ */
.content {
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

/* Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #00313C;
  margin: 0 0 0.35rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.9rem;
  color: #64748B;
  margin: 0;
}

.draft-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.825rem;
  color: #64748B;
  font-weight: 500;
}

.green-dot {
  width: 8px;
  height: 8px;
  background-color: #10B981;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

/* ============================================================
   STEPPER COMPONENT
============================================================ */
.stepper-wrapper {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0 1rem 0;
}

.stepper-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 520px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F1F5F9;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.step-item.active .step-circle {
  background: #D20C4F;
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(210, 12, 79, 0.3);
}

.step-item.completed .step-circle {
  background: #00313C;
  color: #FFFFFF;
}

.step-label {
  font-size: 0.775rem;
  font-weight: 600;
  color: #64748B;
}

.step-item.active .step-label {
  color: #0F172A;
  font-weight: 700;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #E2E8F0;
  margin-top: -1.25rem;
  transition: background-color 0.2s ease;
}

.step-line.completed {
  background: #00313C;
}

/* ============================================================
   MAIN 2-COLUMNS FORM CARD
============================================================ */
.form-main-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #EEF2F6;
  padding: 2.25rem;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03);
}

.form-grid-layout {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 3rem;
}

/* Left Column */
.left-form-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.825rem;
  font-weight: 700;
  color: #1E293B;
}

/* Select */
.custom-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-select-control {
  appearance: none;
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0F172A;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}

.form-select-control:focus {
  border-color: #00313C;
  background: #FFFFFF;
}

.field-arrow {
  position: absolute;
  right: 1rem;
  color: #64748B;
  pointer-events: none;
  font-size: 0.8rem;
}

/* Segmented Control */
.segmented-control {
  display: flex;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 0.3rem;
  border-radius: 12px;
  gap: 0.25rem;
}

.segment-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
}

.segment-btn.active {
  background: #00313C;
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0, 49, 60, 0.15);
}

/* Inline Triplet Inputs (Date, Heure, Duration) */
.inline-triplet-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.triplet-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-leading-icon {
  position: absolute;
  left: 0.85rem;
  color: #64748B;
  font-size: 0.95rem;
  pointer-events: none;
}

.triplet-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.4rem;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0F172A;
  outline: none;
  transition: all 0.2s;
}

.triplet-input:focus {
  border-color: #00313C;
  background: #FFFFFF;
}

/* Textarea */
.textarea-wrapper {
  width: 100%;
}

.form-textarea-control {
  width: 100%;
  padding: 0.85rem 1rem;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #334155;
  outline: none;
  resize: vertical;
  line-height: 1.5;
  transition: all 0.2s;
}

.form-textarea-control::placeholder {
  color: #94A3B8;
  font-style: italic;
}

.form-textarea-control:focus {
  border-color: #00313C;
  background: #FFFFFF;
}

/* Dashed Button + Planifier */
.dashed-action-wrapper {
  margin-top: 0.5rem;
}

.btn-dashed-planifier {
  width: 100%;
  padding: 0.85rem 1.5rem;
  background: transparent;
  border: 1.5px dashed #D20C4F;
  border-radius: 12px;
  color: #D20C4F;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-dashed-planifier:hover {
  background: #FFF1F2;
  border-color: #BE123C;
  color: #BE123C;
}

/* Right Column (Participants Selection) */
.right-selection-column {
  display: flex;
  flex-direction: column;
}

.selection-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.selection-section-header {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #0F172A;
  text-transform: uppercase;
  margin: 0;
}

.person-cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.person-select-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 0.85rem;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.person-select-card:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.person-select-card.selected {
  border-color: #10B981;
  background: #FFFFFF;
}

.person-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.person-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.person-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0F172A;
}

.person-role {
  font-size: 0.725rem;
  color: #64748B;
}

.toggle-status-icon {
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-status-icon.checked {
  color: #10B981;
}

.toggle-status-icon.unchecked {
  color: #CBD5E1;
}

.btn-dashed-add-participant {
  width: 100%;
  padding: 0.6rem 1rem;
  background: transparent;
  border: 1.5px dashed #CBD5E1;
  border-radius: 20px;
  color: #64748B;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: all 0.15s;
}

.btn-dashed-add-participant:hover {
  border-color: #00313C;
  color: #00313C;
  background: #F8FAFC;
}

/* ============================================================
   STEP 3: CONFIRMATION SCREEN
============================================================ */
.confirmation-screen-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #EEF2F6;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.confirmation-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.confirm-icon-box {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ECFDF5;
  color: #10B981;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.confirm-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #00313C;
  margin: 0 0 0.35rem 0;
}

.confirm-subtitle {
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  background: #F8FAFC;
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.725rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0F172A;
}

.summary-badge {
  display: inline-block;
  align-self: flex-start;
  background: #00313C;
  color: #FFFFFF;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.selected-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  padding: 0.3rem 0.65rem;
  border-radius: 20px;
  font-size: 0.775rem;
  font-weight: 600;
  color: #334155;
}

.mini-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}

.confirmation-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.btn-step-back {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  color: #475569;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s;
}

.btn-step-back:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.btn-step-confirm {
  background: #D20C4F;
  border: none;
  color: #FFFFFF;
  padding: 0.75rem 1.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.15s;
  box-shadow: 0 4px 12px rgba(210, 12, 79, 0.25);
}

.btn-step-confirm:hover {
  background: #B50942;
  transform: translateY(-1px);
}

.alert-error-banner {
  background-color: #FEF2F2;
  border: 1px solid #FCA5A5;
  color: #B91C1C;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 992px) {
  .form-grid-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .topbar {
    padding: 0 1rem;
  }
  .search-box {
    width: 200px;
  }
  .content {
    padding: 1rem;
  }
  .inline-triplet-grid {
    grid-template-columns: 1fr;
  }
  .page-header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
