<template>
  <div class="app-layout">
    <CandidateSidebar :active-view="'tests'" @logout="handleLogout" />

    <div class="main-content">
      <header class="topbar">
        <div class="d-flex align-items-center gap-3">
          <i class="fa-regular fa-file-lines text-danger fs-4"></i>
          <h1 class="page-title mb-0">Mes tests</h1>
        </div>

        <div class="d-flex align-items-center gap-3">
          <button type="button" class="notification-button position-relative">
            <i class="fa-regular fa-bell fs-5"></i>
            <span class="notification-badge">3</span>
          </button>

          <div class="campaign-selector">
            <span class="campaign-label">Campagne</span>
            <div class="campaign-name">
              DWWM 2026
              <i class="fa-solid fa-chevron-down ms-1"></i>
            </div>
          </div>
        </div>
      </header>

      <div class="content-area">
        <div class="content-grid">
          <div class="main-column">
            <div class="statistics-row">
              <div class="stat-card">
                <div class="stat-label">Tests disponibles</div>
                <div class="stat-value">{{ statistics.total }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Tests soumis</div>
                <div class="stat-value">{{ statistics.submitted }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Tests restants</div>
                <div class="stat-value">{{ statistics.remaining }}</div>
              </div>
            </div>

            <div class="tests-list">
              <div class="test-card">
                <div class="test-header">
                  <div class="test-icon-circle" style="background: #FDF2F8; color: #D20C4F;">
                    <i class="fa-solid fa-code fs-4"></i>
                  </div>
                  <div class="test-info">
                    <h3 class="test-title">Test technique - Développement Web</h3>
                    <p class="test-description">Évaluation de vos compétences en HTML, CSS et JavaScript.</p>
                  </div>
                </div>

                <div class="test-body">
                  <div class="test-meta">
                    <span class="meta-item">
                      <i class="fa-regular fa-clock me-1"></i>
                      45 min
                    </span>
                    <span class="meta-item">
                      <i class="fa-regular fa-calendar me-1"></i>
                      22 août 2026
                    </span>
                  </div>

                  <div class="test-actions">
                    <span class="status-badge available">Disponible</span>
                    <button class="btn btn-submit btn-sm" @click="openSubmitModal('Test technique - Développement Web')">
                      <i class="fa-solid fa-paper-plane me-1"></i>
                      Soumettre
                    </button>
                  </div>
                </div>
              </div>

            

              <div class="test-card submitted">
                <div class="test-header">
                  <div class="test-icon-circle" style="background: #DCFCE7; color: #16A34A;">
                    <i class="fa-solid fa-check fs-4"></i>
                  </div>
                  <div class="test-info">
                    <h3 class="test-title">Test technique - Git & Collaboration</h3>
                    <p class="test-description">Gestion de version et travail en équipe.</p>
                  </div>
                </div>

                <div class="test-body">
                  <div class="test-meta">
                    <span class="meta-item">
                      <i class="fa-regular fa-clock me-1"></i>
                      20 min
                    </span>
                    <span class="meta-item">
                      <i class="fa-regular fa-calendar me-1"></i>
                      21 août 2026
                    </span>
                  </div>

                  <div class="test-actions">
                    <span class="status-badge submitted">Soumis</span>
                    <span class="text-muted small">Soumis le 21 août 2026 à 14:30</span>
                  </div>
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
                <h4 class="info-card-title mb-0">Instructions</h4>
              </div>
              <ul class="info-list">
                <li>Réalisez chaque test dans le délai imparti.</li>
                <li>Déposez vos réponses via le bouton <strong>Soumettre</strong>.</li>
                <li>Vous pouvez soumettre une seule fois par test.</li>
                <li>Conservez le lien de votre repository et le site déployé.</li>
              </ul>
            </div>

            <div class="summary-card">
              <h4 class="summary-title mb-3">Résumé</h4>
              <div class="progress-chart">
                <div class="circular-progress">
                  <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                      stroke-dasharray="33, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div class="progress-text">
                    <span class="progress-number">1/3</span>
                    <span class="progress-label">tests soumis</span>
                  </div>
                </div>
                <div class="progress-legend">
                  <div class="legend-item">
                    <span class="legend-dot available"></span>
                    <span>Disponibles — 3</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot submitted"></span>
                    <span>Soumis — 1</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot remaining"></span>
                    <span>Restants — 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSubmitModal" class="modal-overlay" @click.self="closeSubmitModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Soumettre un test</h3>
          <button class="modal-close" @click="closeSubmitModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body">
          <p class="mb-3">Vous soumettez le test : <strong>{{ selectedTest }}</strong></p>

          <div class="mb-3">
            <label class="form-label">Repository</label>
            <input v-model="submission.repository" type="text" class="form-control" placeholder="https://github.com/username/repo" />
          </div>

          <div class="mb-3">
            <label class="form-label">Site déployé</label>
            <input v-model="submission.site" type="text" class="form-control" placeholder="https://mon-site.netlify.app" />
          </div>

          <div class="mb-3">
            <label class="form-label">Commentaire</label>
            <textarea v-model="submission.comment" class="form-control" rows="3" placeholder="Informations complémentaires..."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline-secondary" @click="closeSubmitModal">Annuler</button>
          <button class="btn btn-submit" @click="confirmSubmission">
            <i class="fa-solid fa-paper-plane me-1"></i>
            Confirmer la soumission
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import CandidateSidebar from '@/components/CandidateSidebar.vue'

const statistics = reactive({
  total: 3,
  submitted: 1,
  remaining: 2
})

const showSubmitModal = ref(false)
const selectedTest = ref('')
const submission = reactive({
  repository: '',
  site: '',
  comment: ''
})

const handleLogout = () => {
  console.log("Déconnexion de l'utilisateur")
}

const openSubmitModal = (testTitle) => {
  selectedTest.value = testTitle
  submission.repository = ''
  submission.site = ''
  submission.comment = ''
  showSubmitModal.value = true
}

const closeSubmitModal = () => {
  showSubmitModal.value = false
}

const confirmSubmission = () => {
  statistics.submitted += 1
  statistics.remaining -= 1
  statistics.total = statistics.submitted + statistics.remaining
  alert('Votre test a été soumis avec succès.')
  closeSubmitModal()
}
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

.statistics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: box-shadow 0.15s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.tests-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.test-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: box-shadow 0.15s;
}

.test-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.test-header {
  display: flex;
  gap: 16px;
}

.test-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.test-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.test-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.test-description {
  font-size: 13px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

.test-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.test-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-item {
  font-size: 13px;
  color: #4B5563;
  display: flex;
  align-items: center;
}

.test-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.available {
  background: #DCFCE7;
  color: #16A34A;
}

.status-badge.submitted {
  background: #EFF6FF;
  color: #2563EB;
}

.small {
  font-size: 12px;
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

.legend-dot.available {
  background: #16A34A;
}

.legend-dot.submitted {
  background: #2563EB;
}

.legend-dot.remaining {
  background: #E5E7EB;
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

  .test-card {
    flex-direction: column;
  }

  .test-body {
    flex-direction: column;
    align-items: flex-start;
  }

  .statistics-row {
    grid-template-columns: 1fr;
  }
}
</style>
