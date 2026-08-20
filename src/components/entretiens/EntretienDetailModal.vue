<script setup>
defineProps({
  entretien: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'edit'])
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card">
      <!-- Header -->
      <div class="modal-header">
        <div class="d-flex align-items-center gap-3">
          <div class="program-icon" :style="{ backgroundColor: entretien.iconBg, color: entretien.iconColor }">
            <i :class="['bi', `bi-${entretien.icon}`]"></i>
          </div>
          <div>
            <h3 class="modal-title">{{ entretien.program }}</h3>
            <span class="modal-subtitle">{{ entretien.department }}</span>
          </div>
        </div>
        <button class="btn-close-custom" @click="emit('close')" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Infos badges row -->
        <div class="info-badges">
          <div class="info-chip">
            <i class="bi bi-calendar3"></i>
            <span>{{ entretien.windowLabel }} ({{ entretien.windowSub }})</span>
          </div>
          <div class="info-chip">
            <i class="bi bi-clock"></i>
            <span>{{ entretien.day }} • {{ entretien.time }}</span>
          </div>
          <div class="info-chip">
            <i class="bi bi-hourglass-split"></i>
            <span>{{ entretien.duration || '45 Minutes' }}</span>
          </div>
          <div class="type-pill" :class="entretien.type === 'TECHNIQUE' ? 'type-tech' : 'type-moti'">
            {{ entretien.type }}
          </div>
        </div>

        <!-- Notes Section -->
        <div class="detail-section">
          <h5 class="section-title">Objectifs & Notes d'évaluation</h5>
          <div class="notes-box">
            {{ entretien.notes || 'Aucune note particulière renseignée pour cette session.' }}
          </div>
        </div>

        <!-- Recruiters Section -->
        <div class="detail-section">
          <h5 class="section-title">Équipe des Recruteurs ({{ entretien.recruiters?.length || 0 }})</h5>
          <div class="participants-list">
            <div v-for="recruiter in entretien.recruiters" :key="recruiter.id || recruiter.name" class="participant-card">
              <img :src="recruiter.avatar" :alt="recruiter.name" class="participant-avatar" />
              <div class="participant-info">
                <span class="participant-name">{{ recruiter.name }}</span>
                <span class="participant-role">{{ recruiter.role }}</span>
              </div>
              <span class="badge-jury">Jury assigné</span>
            </div>
          </div>
        </div>

        <!-- Candidates Section -->
        <div class="detail-section">
          <h5 class="section-title">Candidats convoqués</h5>
          <div class="participants-list">
            <div v-for="candidate in entretien.candidates" :key="candidate.id || candidate.name" class="participant-card">
              <img :src="candidate.avatar" :alt="candidate.name" class="participant-avatar" />
              <div class="participant-info">
                <span class="participant-name">{{ candidate.name }}</span>
                <span class="participant-role">{{ candidate.role || 'Candidat' }}</span>
              </div>
              <span class="status-badge-confirmed">
                <i class="bi bi-check-circle-fill"></i> Convoqué
              </span>
            </div>
            <div v-if="entretien.extraCandidatesCount > 0" class="extra-candidates-hint">
              + {{ entretien.extraCandidatesCount }} autres candidats inscrits à cette session
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn-secondary-custom" @click="emit('close')">Fermer</button>
        <button class="btn-primary-custom" @click="emit('edit', entretien)">
          <i class="bi bi-pencil-square"></i> Modifier la session
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
  max-width: 680px;
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

.program-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #94A3B8;
  text-transform: uppercase;
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

.info-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.info-chip {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.825rem;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.info-chip i {
  color: #0284C7;
}

.type-pill {
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.type-tech {
  background: #00313C;
  color: #FFFFFF;
}

.type-moti {
  background: #F1F5F9;
  color: #475569;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0F172A;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.notes-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.5;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.participant-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.85rem;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
}

.participant-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.participant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.participant-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0F172A;
}

.participant-role {
  font-size: 0.75rem;
  color: #64748B;
}

.badge-jury {
  background: #EFF6FF;
  color: #1D4ED8;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.status-badge-confirmed {
  color: #16A34A;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.extra-candidates-hint {
  font-size: 0.8rem;
  color: #64748B;
  font-style: italic;
  padding: 0.25rem 0.5rem;
}

.btn-copy-link {
  background: #FFFFFF;
  border: 1px solid #86EFAC;
  color: #166534;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.15s;
}

.btn-copy-link:hover {
  background: #DCFCE7;
}

.modal-footer {
  padding: 1rem 1.75rem;
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary-custom {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  color: #475569;
  padding: 0.55rem 1.15rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary-custom:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.btn-primary-custom {
  background: #D20C4F;
  border: none;
  color: #FFFFFF;
  padding: 0.55rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.15s;
}

.btn-primary-custom:hover {
  background: #B80A45;
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
