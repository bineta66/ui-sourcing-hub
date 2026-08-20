<script setup>
defineProps({
  entretien: {
    type: Object,
    required: true
  },
  isDeleting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancel', 'confirm'])
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('cancel')">
    <div class="modal-card">
      <div class="delete-icon-wrapper">
        <i class="bi bi-trash3-fill"></i>
      </div>

      <h3 class="modal-title">Supprimer cet entretien ?</h3>
      <p class="modal-description">
        Vous êtes sur le point d'annuler et de supprimer définitivement la session d'entretien
        <strong>« {{ entretien.program }} »</strong> prévue le {{ entretien.day }} ({{ entretien.time }}).
      </p>

      <div class="warning-box">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>Cette action notifiera automatiquement tous les recruteurs et candidats assignés.</span>
      </div>

      <div class="modal-actions">
        <button
          type="button"
          class="btn-cancel"
          :disabled="isDeleting"
          @click="emit('cancel')"
        >
          Annuler
        </button>
        <button
          type="button"
          class="btn-confirm-delete"
          :disabled="isDeleting"
          @click="emit('confirm')"
        >
          <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else><i class="bi bi-trash3 me-1"></i> Supprimer</span>
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
  z-index: 1060;
  padding: 1rem;
  animation: fadeIn 0.15s ease-out;
}

.modal-card {
  background: #FFFFFF;
  border-radius: 18px;
  width: 100%;
  max-width: 460px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.2s ease-out;
}

.delete-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #FEE2E2;
  color: #DC2626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.modal-description {
  font-size: 0.9rem;
  color: #64748B;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.warning-box {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.8rem;
  color: #B45309;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: left;
  margin-bottom: 1.5rem;
  width: 100%;
}

.warning-box i {
  font-size: 1rem;
  flex-shrink: 0;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.btn-cancel {
  flex: 1;
  background: #F1F5F9;
  border: none;
  color: #475569;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.btn-confirm-delete {
  flex: 1;
  background: #DC2626;
  border: none;
  color: #FFFFFF;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.btn-confirm-delete:hover {
  background: #B91C1C;
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
