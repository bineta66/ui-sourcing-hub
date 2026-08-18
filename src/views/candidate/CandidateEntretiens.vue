<template>
  <div class="app-layout">
    <CandidateSidebar :active-view="'entretiens'" @logout="handleLogout" />

    <div class="main-content">
      <header class="topbar">
        <div class="d-flex align-items-center gap-3">
          <i class="fa-regular fa-calendar-check text-danger fs-4"></i>
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
              DWWM 2026
              <i class="fa-solid fa-chevron-down ms-1"></i>
            </div>
          </div>
        </div>
      </header>

      <div class="content-area">
        <div class="info-banner">
          <div class="banner-icon">
            <i class="fa-regular fa-calendar-check text-primary fs-2"></i>
          </div>
          <div class="banner-text">
            <h3 class="banner-title">Vos entretiens sont planifiés .</h3>
            <p class="banner-subtitle">Veuillez être présent(e) à l'heure .</p>
          </div>
          <button class="btn btn-outline-primary banner-btn">
            <i class="fa-solid fa-download me-1"></i>
            Voir la convocation globale
          </button>
        </div>

        <div class="tabs-container">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'upcoming' }"
            @click="activeTab = 'upcoming'"
          >
            À venir
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'past' }"
            @click="activeTab = 'past'"
          >
            Passés
          </button>
        </div>

        <div class="content-grid">
          <div class="main-column">
            <div v-if="activeTab === 'upcoming'" class="interviews-list">
              <div class="interview-card">
                <div class="card-left">
                  <div class="interview-icon-circle" style="background: #FDF2F8; color: #D20C4F;">
                    <i class="fa-solid fa-laptop fs-4"></i>
                  </div>
                  <div class="interview-details">
                    <h3 class="interview-title">Entretien technique</h3>
                    <p class="interview-description">Évaluation de vos compétences techniques en développement.</p>
                    <div class="interview-meta">
                      <span class="meta-item">
                        <i class="fa-regular fa-comment-dots me-1"></i>
                        Entretien présentiel
                      </span>
                     
                    </div>
                  </div>
                </div>

                <div class="card-divider"></div>

                <div class="card-right">
                  <div class="interview-schedule">
                    <div class="schedule-item">
                      <i class="fa-regular fa-calendar me-2 text-muted"></i>
                      <span>22 août 2026</span>
                    </div>
                    <div class="schedule-item">
                      <i class="fa-regular fa-clock me-2 text-muted"></i>
                      <span>09:00 - 09:45</span>
                    </div>
                    <div class="schedule-item">
                      <i class="fa-solid fa-hourglass-half me-2 text-muted"></i>
                      <span>Durée : 45 min</span>
                    </div>
                  </div>
                  <div class="card-footer">
                    <span class="status-badge upcoming">À venir</span>
                    <button class="btn btn-outline-primary btn-sm">
                      <i class="fa-regular fa-eye me-1"></i>
                      Voir la convocation
                    </button>
                  </div>
                </div>
              </div>

              <div class="interview-card">
                <div class="card-left">
                  <div class="interview-icon-circle" style="background: #FFF7ED; color: #F59E0B;">
                    <i class="fa-solid fa-comments fs-4"></i>
                  </div>
                  <div class="interview-details">
                    <h3 class="interview-title">Entretien motivationnel</h3>
                    <p class="interview-description">Évaluation de votre motivation, soft skills et projet professionnel.</p>
                    <div class="interview-meta">
                      <span class="meta-item">
                        <i class="fa-regular fa-comment-dots me-1"></i>
                        Entretien présentiel
                      </span>
                      
                    </div>
                  </div>
                </div>

                <div class="card-divider"></div>

                <div class="card-right">
                  <div class="interview-schedule">
                    <div class="schedule-item">
                      <i class="fa-regular fa-calendar me-2 text-muted"></i>
                      <span>22 août 2026</span>
                    </div>
                    <div class="schedule-item">
                      <i class="fa-regular fa-clock me-2 text-muted"></i>
                      <span>10:00 - 10:30</span>
                    </div>
                    <div class="schedule-item">
                      <i class="fa-solid fa-hourglass-half me-2 text-muted"></i>
                      <span>Durée : 30 min</span>
                    </div>
                  </div>
                  <div class="card-footer">
                    <span class="status-badge upcoming">À venir</span>
                    <button class="btn btn-outline-primary btn-sm">
                      <i class="fa-regular fa-eye me-1"></i>
                      Voir la convocation
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'past'" class="interviews-list">
              <div class="section-title mb-3">Entretiens passés</div>

              <div class="interview-card past">
                <div class="card-left">
                  <div class="interview-icon-circle" style="background: #DCFCE7; color: #16A34A;">
                    <i class="fa-solid fa-check fs-4"></i>
                  </div>
                  <div class="interview-details">
                    <h3 class="interview-title">Entretien de présélection</h3>
                    <p class="interview-description">Premier échange pour évaluer votre profil et votre motivation.</p>
                    <div class="interview-meta">
                      <span class="meta-item">
                        <i class="fa-regular fa-calendar me-1"></i>
                        15 août 2026
                      </span>
                      <span class="meta-item">
                        <i class="fa-regular fa-clock me-1"></i>
                        11:00 - 11:30
                      </span>
                      <span class="meta-item">
                        <i class="fa-solid fa-hourglass-half me-1"></i>
                        Durée : 30 min
                      </span>
                    </div>
                  </div>
                </div>

                <div class="card-divider"></div>

                <div class="card-right">
                  <div class="card-footer">
                    <span class="status-badge upcoming">À venir</span>
                    <button class="btn btn-submit btn-sm" @click="openConvocation('Entretien motivationnel')">
                      <i class="fa-regular fa-eye me-1"></i>
                      Voir la convocation
                    </button>
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
                <h4 class="info-card-title mb-0">Informations importantes</h4>
              </div>
              <ul class="info-list">
                <li>Connectez-vous <strong>10 minutes avant chaque entretien.</strong></li>
                <li>Assurez-vous d'être dans un endroit calme.</li>
                <li>Ayez une pièce d'identité à portée de main.</li>
                <li><strong>Bonne chance ! </strong></li>
              </ul>
            </div>

            <div class="summary-card">
              <h4 class="summary-title mb-3">Résumé de vos entretiens</h4>
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
                  
                  </div>
                </div>
                <div class="progress-legend">
                  <div class="legend-item">
                    <span class="legend-dot upcoming"></span>
                    <span>À venir — 2</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot passed"></span>
                    <span>Passés — 1</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot remaining"></span>
                    <span>Restants — 0</span>
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
          <h3 class="modal-title">Convocation - {{ selectedConvocation }}</h3>
          <button class="modal-close" @click="closeConvocation">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="convocation-detail">
            <div class="convocation-row">
              <span class="convocation-label">Type d'entretien</span>
              <span class="convocation-value">{{ selectedConvocation }}</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Date</span>
              <span class="convocation-value">22 août 2026</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Heure</span>
              <span class="convocation-value">09:00 - 09:45</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Durée</span>
              <span class="convocation-value">45 min</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Format</span>
              <span class="convocation-value">Entretien en ligne</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Jury</span>
              <span class="convocation-value">2 membres</span>
            </div>
            <div class="convocation-row">
              <span class="convocation-label">Lien de connexion</span>
              <a href="#" class="convocation-link">https://meet.sourcinghub.example.com/entretien-1</a>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-submit" @click="closeConvocation">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CandidateSidebar from '@/components/CandidateSidebar.vue'

const currentView = ref('entretiens')
const activeTab = ref('upcoming')
const showConvocationModal = ref(false)
const selectedConvocation = ref('')

const handleLogout = () => {
  console.log("Déconnexion de l'utilisateur")
}

const openConvocation = (title) => {
  selectedConvocation.value = title
  showConvocationModal.value = true
}

const closeConvocation = () => {
  showConvocationModal.value = false
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

.info-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: #EFF6FF;
  border-radius: 12px;
  border: 1px solid #DBEAFE;
  width: 100%;
}

.banner-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
  min-width: 0;
}

.banner-title {
  font-size: 16px;
  font-weight: 700;
  color: #1E40AF;
  margin: 0 0 4px;
}

.banner-subtitle {
  font-size: 13px;
  color: #3B82F6;
  margin: 0;
  line-height: 1.5;
}

.banner-btn {
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  color: #2563EB;
  border-color: #2563EB;
}

.banner-btn:hover {
  background: #2563EB;
  color: #FFFFFF;
}

.tabs-container {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #E5E7EB;
}

.tab-btn {
  padding: 12px 0;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  bottom: -1px;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn.active {
  color: #D20C4F;
  border-bottom-color: #D20C4F;
}

.interviews-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #374151;
  flex: 1 1 100%;
}

.interview-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 20px;
  transition: box-shadow 0.15s;
  flex: 1 1 320px;
  min-width: 320px;
}

.interview-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.card-left {
  display: flex;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.interview-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.interview-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.interview-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.interview-description {
  font-size: 13px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

.interview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.meta-item {
  font-size: 13px;
  color: #4B5563;
  display: flex;
  align-items: center;
}

.card-divider {
  width: 1px;
  background: #E5E7EB;
  margin: 0 4px;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  min-width: 180px;
}

.interview-schedule {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: right;
}

.schedule-item {
  font-size: 13px;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.card-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.upcoming {
  background: #DCFCE7;
  color: #16A34A;
}

.status-badge.passed {
  background: #DCFCE7;
  color: #16A34A;
}

.evaluation-score {
  font-size: 13px;
  color: #374151;
}

.side-column {
  position: sticky;
  top: 84px;
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

.legend-dot.upcoming {
  background: #3B82F6;
}

.legend-dot.passed {
  background: #16A34A;
}

.legend-dot.remaining {
  background: #E5E7EB;
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

  .interview-card {
    flex-direction: column;
  }

  .card-divider {
    width: 100%;
    height: 1px;
    margin: 12px 0;
  }

  .card-right {
    align-items: flex-start;
    min-width: auto;
  }

  .interview-schedule {
    text-align: left;
  }

  .schedule-item {
    justify-content: flex-start;
  }

  .card-footer {
    align-items: flex-start;
  }
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
</style>
