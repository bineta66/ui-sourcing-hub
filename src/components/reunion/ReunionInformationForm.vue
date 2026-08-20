<script setup>
import { ref, watch } from 'vue'
import { createReunionInformation, updateReunionInformation } from '@/api/endpoints/reunionInformation'

const props = defineProps({
  campagneId: { type: Number, required: true },
  reunion: { type: Object, default: null }
})

const emit = defineEmits(['saved', 'close'])

const form = ref({
  titre: '',
  date: '',
  lieu: '',
  description: ''
})

const errors = ref({})
const isSubmitting = ref(false)

watch(() => props.reunion, (newVal) => {
  if (newVal) {
    form.value = {
      titre: newVal.titre || '',
      date: newVal.date || '',
      lieu: newVal.lieu || '',
      description: newVal.description || ''
    }
  } else {
    form.value = {
      titre: '',
      date: '',
      lieu: '',
      description: ''
    }
  }
  errors.value = {}
}, { immediate: true })

const validate = () => {
  errors.value = {}

  if (!form.value.titre.trim()) {
    errors.value.titre = 'Le titre est obligatoire.'
  }

  if (!form.value.date) {
    errors.value.date = 'La date est obligatoire.'
  }

  if (!form.value.lieu.trim()) {
    errors.value.lieu = 'Le lieu est obligatoire.'
  }

  return Object.keys(errors.value).length === 0
}

const submit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  errors.value = {}

  try {
    if (!Number.isFinite(props.campagneId)) {
      throw new Error('Identifiant de campagne invalide.')
    }

    let response
    if (props.reunion) {
      response = await updateReunionInformation(props.campagneId, form.value)
    } else {
      response = await createReunionInformation(props.campagneId, form.value)
    }
    emit('saved', response.data)
  } catch (err) {
    const data = err.response?.data
    if (data) {
      if (data.detail) {
        errors.value.general = data.detail
      } else {
        errors.value = data
      }
    } else {
      errors.value.general = err.message || 'Erreur lors de l\'enregistrement.'
    }
    console.error('[ReunionInformationForm] submit failed', {
      url: err.config?.url,
      method: err.config?.method,
      status: err.response?.status,
      data: err.response?.data,
    })
  } finally {
    isSubmitting.value = false
  }
}

const close = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-box">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h2 class="form-title" style="font-size: 18px;">
          {{ reunion ? 'Modifier la réunion d\'information' : 'Planifier la réunion d\'information' }}
        </h2>
        <button type="button" class="close-button" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div v-if="errors.general" class="alert alert-danger py-2 mb-3">
        {{ errors.general }}
      </div>

      <div class="mb-3">
        <label class="custom-label">Titre</label>
        <input
          v-model="form.titre"
          type="text"
          class="form-control custom-input"
          :class="{ 'is-invalid': errors.titre }"
          placeholder="Réunion d'information"
        />
        <div v-if="errors.titre" class="invalid-feedback">
          {{ errors.titre }}
        </div>
      </div>

      <div class="mb-3">
        <label class="custom-label">Date</label>
        <input
          v-model="form.date"
          type="date"
          class="form-control custom-input"
          :class="{ 'is-invalid': errors.date }"
        />
        <div v-if="errors.date" class="invalid-feedback">
          {{ errors.date }}
        </div>
      </div>

      <div class="mb-3">
        <label class="custom-label">Lieu</label>
        <input
          v-model="form.lieu"
          type="text"
          class="form-control custom-input"
          :class="{ 'is-invalid': errors.lieu }"
          placeholder="Dakar"
        />
        <div v-if="errors.lieu" class="invalid-feedback">
          {{ errors.lieu }}
        </div>
      </div>

      <div class="mb-4">
        <label class="custom-label">Description</label>
        <textarea
          v-model="form.description"
          class="form-control custom-textarea"
          placeholder="Description de la réunion..."
          rows="3"
        ></textarea>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn btn-primary"
          :disabled="isSubmitting"
          @click="submit"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ reunion ? 'Enregistrer les modifications' : 'Planifier' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="close">
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-box {
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.form-title {
  color: #00313C;
  font-weight: 700;
}

.custom-label {
  display: block;
  margin-bottom: 6px;
  color: #64748B;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.custom-input {
  min-height: 40px;
  padding: 8px 16px;
  background-color: #F1F5F9;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #1E293B;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.custom-input:focus {
  background-color: #F1F5F9;
  border-color: #D20C4F;
  box-shadow: 0 0 0 0.2rem rgba(210, 12, 79, 0.08);
}

.custom-textarea {
  min-height: 94px;
  padding: 10px 16px;
  background-color: #F1F5F9;
  border: 1px solid transparent;
  border-radius: 8px;
  resize: vertical;
  color: #1E293B;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.custom-textarea:focus {
  background-color: #F1F5F9;
  border-color: #D20C4F;
  box-shadow: 0 0 0 0.2rem rgba(210, 12, 79, 0.08);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.close-button {
  border: none;
  background: transparent;
  color: #64748B;
  font-size: 18px;
  cursor: pointer;
}

.close-button:hover {
  color: #D20C4F;
}
</style>
