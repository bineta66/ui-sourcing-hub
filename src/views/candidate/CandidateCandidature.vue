<template>
  <div class="app-layout">
    <CandidateSidebar :active-view="'candidature'" @logout="handleLogout" />

    <div class="main-content">
      <header class="topbar">
        <div class="d-flex align-items-center gap-3">
          <i class="fa-regular fa-user text-danger fs-4"></i>
          <h1 class="page-title mb-0">Ma candidature</h1>
        </div>

        <div class="d-flex align-items-center gap-3">
          <button type="button" class="notification-button position-relative">
            <i class="fa-regular fa-bell fs-5"></i>
            <span class="notification-badge">3</span>
          </button>

          <div class="campaign-selector">
            <span class="campaign-label">Campagne</span>
            <div class="campaign-name">
              {{ nextInterview?.campagne_titre || 'Session Active' }}
            </div>
          </div>
        </div>
      </header>

      <div class="content-area">
        <div class="content-grid">
          <div class="main-column">
            <div class="application-card">
              <div class="application-header">
                <div class="application-icon-circle" style="background: #FDF2F8; color: #D20C4F;">
                  <i class="fa-solid fa-file-lines fs-4"></i>
                </div>
                <div class="application-info">
                  <h2 class="application-title">{{ nextInterview?.campagne_titre || 'Ma Candidature' }}</h2>
                  <p class="application-description">Dossier de candidature de {{ authStore.displayName }}</p>
                </div>
              </div>

              <div class="application-body">
                <div class="application-meta">
                  <div class="meta-block">
                    <span class="meta-label">Statut</span>
                    <span class="status-badge success">{{ nextInterview ? 'Convoqué(e)' : 'Enregistrée' }}</span>
                  </div>
                  <div class="meta-block">
                    <span class="meta-label">Candidat</span>
                    <span class="meta-value">{{ authStore.displayName }}</span>
                  </div>
                  <div class="meta-block">
                    <span class="meta-label">Prochain entretien</span>
                    <span class="meta-value">{{ nextInterview ? formatDate(nextInterview.date) : 'En attente de programmation' }}</span>
                  </div>
                </div>

                <div class="application-actions">
                  <button v-if="nextInterview" class="btn btn-submit" @click="openConvocation('Détails de ma convocation', nextInterview)">
                    <i class="fa-regular fa-eye me-1"></i>
                    Voir ma convocation
                  </button>
                  <router-link to="/candidat/entretiens" class="btn btn-outline-primary">
                    <i class="fa-regular fa-calendar-check me-1"></i>
                    Consulter mes entretiens
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div class="side-column">
            <div class="info-card">
              <div class="info-card-header">
                <div class="info-icon-circle">
                  <i class="fa-regular fa-circle-info text-primary"></i>
                </div>
                <h4 class="info-card-title mb-0">Informations utiles</h4>
              </div>
              <ul class="info-list">
                <li>Email associé : <strong>{{ authStore.userEmail }}</strong></li>
                <li>Présentez-vous 10 minutes avant chaque entretien.</li>
                <li>Munissez-vous d'une pièce d'identité.</li>
                <li>Contactez l'équipe pédagogique en cas d'empêchement.</li>
              </ul>
            </div>

            <div class="summary-card">
              <h4 class="summary-title mb-3">Suivi de candidature</h4>
              <div class="progress-chart">
                <div class="circular-progress">
                  <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                      stroke-dasharray="100, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div class="progress-text">
                    <span class="progress-number">{{ convocations.length > 0 ? convocations.length : 1 }}</span>
                    <span class="progress-label">{{ convocations.length > 0 ? 'convocation(s)' : 'dossier actif' }}</span>
                  </div>
                </div>
                <div class="progress-legend">
                  <div class="legend-item">
                    <span class="legend-dot passed"></span>
                    <span>Dossier enregistré</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot passed"></span>
                    <span>Profil actif</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot upcoming"></span>
                    <span>Entretiens programmés</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConvocationModal" class="modal-overlay" @click.self="closeConvocation">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedConvocation }}</h3>
          <button class="modal-close" @click="closeConvocation">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="convocation-detail">
            <div class="convocation-row">
              <span class="convocation-label">Campagne</span>
              <span class="convocation-value">{{ selectedConvocationData?.campagne_titre || 'Campagne active' }}</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Candidat</span>
              <span class="convocation-value">{{ authStore.displayName }}</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Date</span>
              <span class="convocation-value">{{ formatDate(selectedConvocationData?.date) }}</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Heure</span>
              <span class="convocation-value">{{ selectedConvocationData?.heure_debut?.substring(0, 5) }} {{ selectedConvocationData?.heure_fin ? '- ' + selectedConvocationData.heure_fin.substring(0, 5) : '' }}</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Lieu / Format</span>
              <span class="convocation-value">{{ selectedConvocationData?.lieu || 'Simplon Sénégal' }}</span>
            </div>
            <div v-if="selectedConvocationData?.lien_visio" class="convocation-row">
              <span class="convocation-label">Lien de visio</span>
              <a :href="selectedConvocationData.lien_visio" target="_blank" class="convocation-link">{{ selectedConvocationData.lien_visio }}</a>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Instructions</span>
              <span class="convocation-value">Veuillez vous présenter 10 minutes avant l'heure prévue.</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" @click="closeConvocation">Fermer</button>
          <button class="btn btn-submit" @click="confirmConvocation">
            <i class="fa-solid fa-check me-1"></i>
            J'ai pris connaissance
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CandidateSidebar from '@/components/CandidateSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { getMesConvocations } from '@/api/endpoints/convocations'

const router = useRouter()
const authStore = useAuthStore()
const currentView = ref('candidature')
const showConvocationModal = ref(false)
const selectedConvocation = ref('')
const selectedConvocationData = ref(null)
const convocations = ref([])
const loading = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const nextInterview = computed(() => {
  return convocations.value.length > 0 ? convocations.value[0] : null
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'Date à définir'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const openConvocation = (title, conv = null) => {
  selectedConvocation.value = title
  selectedConvocationData.value = conv || nextInterview.value
  showConvocationModal.value = true
}

const closeConvocation = () => {
  showConvocationModal.value = false
  selectedConvocationData.value = null
}

const confirmConvocation = () => {
  closeConvocation()
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await getMesConvocations()
    convocations.value = Array.isArray(data) ? data : (data?.results || [])
  } catch (err) {
    console.error('Erreur récupération convocations:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #FFFFFF;
  font-family: 'Inter', 'Nunito Sans', sans-serif;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  z-index: 20;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.notification-button {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  background: #FFFFFF;
  color: #4B5563;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.notification-button:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #EF4444;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFFFFF;
}

.campaign-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.15s;
}

.campaign-selector:hover {
  background: #F9FAFB;
}

.campaign-label {
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.campaign-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
}

.content-area {
  flex: 1;
  padding: 24px 32px 32px;
  overflow-y: auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.main-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.application-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.application-header {
  display: flex;
  gap: 16px;
}

.application-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.application-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.application-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.application-description {
  font-size: 13px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

.application-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.application-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.meta-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-label {
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-value {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.success {
  background: #DCFCE7;
  color: #16A34A;
}

.application-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.info-icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #EFF6FF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-list li {
  font-size: 13px;
  color: #4B5563;
  line-height: 1.5;
  padding-left: 16px;
  position: relative;
}

.info-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3B82F6;
}

.summary-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
}

.summary-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px;
}

.progress-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.circular-progress {
  position: relative;
  width: 120px;
  height: 120px;
}

.circular-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: #E5E7EB;
  stroke-width: 3;
}

.circle {
  fill: none;
  stroke: #D20C4F;
  stroke-width: 3;
  stroke-linecap: round;
}

.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.progress-number {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.progress-label {
  font-size: 11px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-legend {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot.passed {
  background: #16A34A;
}

.legend-dot.upcoming {
  background: #3B82F6;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1060;
}

.modal-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 520px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #F3F4F6;
  color: #4B5563;
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.modal-close:hover {
  background: #E5E7EB;
  color: #111827;
}

.modal-body {
  padding: 20px 24px;
}

.convocation-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.convocation-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F3F4F6;
}

.convocation-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.convocation-label {
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
}

.convocation-value {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.convocation-link {
  font-size: 13px;
  font-weight: 600;
  color: #D20C4F;
  text-decoration: none;
}

.convocation-link:hover {
  text-decoration: underline;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 24px 20px;
}

.btn-submit {
  background: #D20C4F;
  border-color: #D20C4F;
  color: #FFFFFF;
  font-weight: 600;
}

.btn-submit:hover {
  background: #b9103f;
  border-color: #b9103f;
  color: #FFFFFF;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    position: static;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 16px;
  }

  .application-card {
    flex-direction: column;
  }

  .application-actions {
    flex-direction: column;
  }
}
</style>
