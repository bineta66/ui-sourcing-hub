<script setup>
import { ref, watch } from 'vue'
import { createCreneau, updateCreneau } from '@/api/endpoints/reunionInformation'

const props = defineProps({
  campagneId: { type: Number, required: true },
  reunion: { type: Object, required: true },
  creneau: { type: Object, default: null },
  creneaux: { type: Array, default: () => [] }
})

const emit = defineEmits(['saved', 'close'])

const form = ref({
  nom: '',
  heure_debut: '',
  heure_fin: '',
  capacite: 20
})

const errors = ref({})
const isSubmitting = ref(false)

watch(() => props.creneau, (newVal) => {
  if (newVal) {
    form.value = {
      nom: newVal.nom || '',
      heure_debut: newVal.heure_debut || '',
      heure_fin: newVal.heure_fin || '',
      capacite: newVal.capacite || 20
    }
  } else {
    form.value = {
      nom: '',
      heure_debut: '',
      heure_fin: '',
      capacite: 20
    }
  }
  errors.value = {}
}, { immediate: true })

const validate = () => {
  errors.value = {}

  if (!form.value.heure_debut) {
    errors.value.heure_debut = 'L\'heure de début est obligatoire.'
  }

  if (!form.value.heure_fin) {
    errors.value.heure_fin = 'L\'heure de fin est obligatoire.'
  }

  if (form.value.heure_debut && form.value.heure_fin && form.value.heure_fin <= form.value.heure_debut) {
    errors.value.heure_fin = 'L\'heure de fin doit être supérieure à l\'heure de début.'
  }

  if (form.value.capacite !== '' && form.value.capacite !== null && form.value.capacite !== undefined) {
    if (Number(form.value.capacite) <= 0) {
      errors.value.capacite = 'La capacité doit être positive.'
    }
  }

  if (Object.keys(errors.value).length === 0 && form.value.heure_debut && form.value.heure_fin) {
    const overlapping = props.creneaux.find((c) => {
      if (props.creneau && c.id === props.creneau.id) {
        return false
      }
      return form.value.heure_debut < c.heure_fin && c.heure_debut < form.value.heure_fin
    })

    if (overlapping) {
      errors.value.heure_fin = 'Ce créneau chevauche un créneau existant.'
    }
  }

  return Object.keys(errors.value).length === 0
}

const submit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  errors.value = {}

  try {
    const payload = {
      ...form.value,
      capacite: form.value.capacite !== '' && form.value.capacite !== null && form.value.capacite !== undefined
        ? Number(form.value.capacite)
        : undefined,
    }

    if (props.creneau) {
      await updateCreneau(props.creneau.id, payload)
    } else {
      await createCreneau(props.reunion.id, payload)
    }

    emit('saved')
  } catch (err) {
    const data = err.response?.data
    if (data) {
      if (data.detail) {
        errors.value.general = data.detail
      } else {
        errors.value = data
      }
    } else {
      errors.value.general = 'Erreur lors de l\'enregistrement du créneau.'
    }
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
          {{ creneau ? 'Modifier le créneau' : 'Ajouter un créneau' }}
        </h2>
        <button type="button" class="close-button" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div v-if="errors.general" class="alert alert-danger py-2 mb-3">
        {{ errors.general }}
      </div>

      <div class="mb-3">
        <label class="custom-label">Nom du groupe / créneau</label>
        <input
          v-model="form.nom"
          type="text"
          class="form-control custom-input"
          placeholder="Ex: Groupe matin, Groupe soir..."
        />
      </div>

      <div class="row g-3 mb-3">
        <div class="col-sm-6">
          <label class="custom-label">Heure début</label>
          <input
            v-model="form.heure_debut"
            type="time"
            class="form-control custom-input"
            :class="{ 'is-invalid': errors.heure_debut }"
          />
          <div v-if="errors.heure_debut" class="invalid-feedback">
            {{ errors.heure_debut }}
          </div>
        </div>

        <div class="col-sm-6">
          <label class="custom-label">Heure fin</label>
          <input
            v-model="form.heure_fin"
            type="time"
            class="form-control custom-input"
            :class="{ 'is-invalid': errors.heure_fin }"
          />
          <div v-if="errors.heure_fin" class="invalid-feedback">
            {{ errors.heure_fin }}
          </div>
        </div>
      </div>

      <div class="mb-4">
        <label class="custom-label">Capacité</label>
        <input
          v-model="form.capacite"
          type="number"
          min="1"
          class="form-control custom-input"
          :class="{ 'is-invalid': errors.capacite }"
        />
        <div v-if="errors.capacite" class="invalid-feedback">
          {{ errors.capacite }}
        </div>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn btn-primary"
          :disabled="isSubmitting"
          @click="submit"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ creneau ? 'Enregistrer' : 'Ajouter' }}
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
  z-index: 1060;
}

.modal-box {
  width: 100%;
  max-width: 480px;
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
