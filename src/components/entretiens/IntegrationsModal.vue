<script setup>
import { useEntretiensStore } from '@/stores/entretiens'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const store = useEntretiensStore()
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card">
      <!-- Header -->
      <div class="modal-header">
        <div class="d-flex align-items-center gap-3">
          <div class="integration-header-icon">
            <i class="bi bi-camera-video"></i>
          </div>
          <div>
            <h3 class="modal-title">Intégration des Réunions & Calendriers</h3>
            <span class="modal-subtitle">Synchronisez vos outils de visioconférence pour générer des liens automatiquement</span>
          </div>
        </div>
        <button class="btn-close-custom" @click="emit('close')" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <p class="intro-text">
          Connectez vos applications favorites pour synchroniser automatiquement les sessions d'entretien avec les agendas de vos recruteurs et générer des liens de visioconférence instantanés.
        </p>

        <div class="integrations-list">
          <!-- Google Meet -->
          <div class="integration-item">
            <div class="app-icon-wrapper" style="background:#FEF2F2;color:#EA4335;">
              <i class="bi bi-google"></i>
            </div>
            <div class="app-info">
              <div class="app-name">Google Meet & Calendar</div>
              <div class="app-desc">Génération automatique des liens Meet et envoi d'invitations Google Agenda.</div>
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input custom-switch"
                type="checkbox"
                :checked="store.integrations.googleMeet"
                @change="store.toggleIntegration('googleMeet')"
              />
            </div>
          </div>

          <!-- Zoom -->
          <div class="integration-item">
            <div class="app-icon-wrapper" style="background:#EFF6FF;color:#2D8CFF;">
              <i class="bi bi-camera-video-fill"></i>
            </div>
            <div class="app-info">
              <div class="app-name">Zoom Meetings</div>
              <div class="app-desc">Création de salles d'attente sécurisées et enregistrement cloud pour les jurys.</div>
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input custom-switch"
                type="checkbox"
                :checked="store.integrations.zoom"
                @change="store.toggleIntegration('zoom')"
              />
            </div>
          </div>

          <!-- Microsoft Teams -->
          <div class="integration-item">
            <div class="app-icon-wrapper" style="background:#EEF2FF;color:#464EB8;">
              <i class="bi bi-microsoft-teams"></i>
            </div>
            <div class="app-info">
              <div class="app-name">Microsoft Teams & Outlook</div>
              <div class="app-desc">Intégration transparente pour les entreprises utilisant Microsoft 365.</div>
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input custom-switch"
                type="checkbox"
                :checked="store.integrations.teams"
                @change="store.toggleIntegration('teams')"
              />
            </div>
          </div>
        </div>

        <div class="sync-status-box">
          <i class="bi bi-shield-check text-success fs-5"></i>
          <div>
            <div class="fw-bold text-dark" style="font-size: 0.85rem;">Connexion chiffrée de bout en bout</div>
            <div class="text-muted" style="font-size: 0.75rem;">Tous les tokens OAuth2 sont sécurisés et respectent les normes RGPD.</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn-primary-custom" @click="emit('close')">
          Enregistrer les préférences
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-card {
  background: #FFFFFF;
  border-radius: 18px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: slideUp 0.25s ease-out;
}

.modal-header {
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #F1F5F9;
}

.integration-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #FDF2F8;
  color: #D20C4F;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.75rem;
  color: #64748B;
}

.btn-close-custom {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  color: #64748B;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-close-custom:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.modal-body {
  padding: 1.5rem 1.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.intro-text {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

.integrations-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.integration-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  transition: all 0.2s;
}

.integration-item:hover {
  border-color: #CBD5E1;
  background: #FFFFFF;
}

.app-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}

.app-info {
  flex: 1;
}

.app-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0F172A;
}

.app-desc {
  font-size: 0.775rem;
  color: #64748B;
  line-height: 1.4;
}

.custom-switch {
  cursor: pointer;
  width: 2.75rem;
  height: 1.5rem;
}

.custom-switch:checked {
  background-color: #10B981;
  border-color: #10B981;
}

.sync-status-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #F0FDF4;
  border: 1px solid #DCFCE7;
  padding: 0.75rem 1rem;
  border-radius: 12px;
}

.modal-footer {
  padding: 1rem 1.75rem;
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.btn-primary-custom {
  background: #00313C;
  border: none;
  color: #FFFFFF;
  padding: 0.55rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary-custom:hover {
  background: #064E5F;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
