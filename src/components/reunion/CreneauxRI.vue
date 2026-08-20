<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import CreneauRIForm from './CreneauRIForm.vue'
import {
  getCreneaux,
  createCreneau,
  updateCreneau,
  deleteCreneau
} from '@/api/endpoints/reunionInformation'

const props = defineProps({
  campagneId: { type: Number, required: true },
  reunion: { type: Object, required: true }
})

const emit = defineEmits(['updated', 'close'])

const creneauxList = ref([])
const creneaux = computed(() => creneauxList.value)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const showCreneauForm = ref(false)
const editingCreneau = ref(null)

const fetchCreneaux = async () => {
  if (!props.reunion?.id) return
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await getCreneaux(props.reunion.id)
    creneauxList.value = data
  } catch (err) {
    errorMessage.value = err.response?.data?.detail || 'Erreur lors du chargement des créneaux.'
  } finally {
    loading.value = false
  }
}

watch(() => props.reunion?.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    creneauxList.value = []
    fetchCreneaux()
  }
})

onMounted(() => {
  fetchCreneaux()
})

const openCreateCreneau = () => {
  editingCreneau.value = null
  showCreneauForm.value = true
}

const openEditCreneau = (creneau) => {
  editingCreneau.value = creneau
  showCreneauForm.value = true
}

const confirmDeleteCreneau = async (creneau) => {
  if (!confirm('Voulez-vous vraiment supprimer ce créneau ?')) {
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    await deleteCreneau(creneau.id)
    successMessage.value = 'Créneau supprimé avec succès.'
    await fetchCreneaux()
    emit('updated')
  } catch (err) {
    errorMessage.value = err.response?.data?.detail || 'Erreur lors de la suppression.'
  } finally {
    loading.value = false
  }
}

const handleCreneauSaved = async () => {
  showCreneauForm.value = false
  editingCreneau.value = null
  await fetchCreneaux()
  emit('updated')
}

const handleCloseCreneauForm = () => {
  showCreneauForm.value = false
  editingCreneau.value = null
}

const formatTime = (time) => {
  if (!time) return ''
  return time.substring(0, 5)
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box modal-box-large">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h2 class="form-title" style="font-size: 18px;">Créneaux de la réunion d'information</h2>
          <p class="text-muted fs-7 mb-0">
            {{ reunion.date }} - {{ reunion.lieu }}
          </p>
        </div>
        <button type="button" class="close-button" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div v-if="errorMessage" class="alert alert-danger py-2 mb-3">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="alert alert-success py-2 mb-3">
        {{ successMessage }}
      </div>

      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-2">Chargement...</p>
      </div>

      <div v-else>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold text-dark-blue mb-0">Créneaux disponibles</h6>
          <button
            type="button"
            class="btn btn-primary btn-sm rounded-3 px-3 py-2 fw-bold"
            @click="openCreateCreneau"
          >
            <i class="fa-solid fa-plus me-2"></i>
            Ajouter un créneau
          </button>
        </div>

        <div v-if="creneaux.length === 0" class="text-center py-4">
          <i class="fa-regular fa-clock fs-1 text-muted mb-3"></i>
          <p class="text-muted mb-0">Aucun créneau n'a encore été ajouté.</p>
        </div>

        <div v-else class="d-flex flex-column gap-3">
          <div
            v-for="creneau in creneaux"
            :key="creneau.id"
            class="card border-0 shadow-sm rounded-4"
          >
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <span v-if="creneau.nom" class="badge bg-primary-subtle text-primary fw-bold">
                      {{ creneau.nom }}
                    </span>
                    <span class="fw-bold text-dark-blue">
                      {{ formatTime(creneau.heure_debut) }} - {{ formatTime(creneau.heure_fin) }}
                    </span>
                  </div>
                  <div class="d-flex gap-3 text-muted fs-7">
                    <span>
                      <i class="fa-solid fa-users me-1"></i>
                      {{ creneau.nombre_candidats ?? 0 }} candidat(s)
                    </span>
                    <span v-if="creneau.capacite">
                      <i class="fa-solid fa-chair me-1"></i>
                      Capacité : {{ creneau.capacite }} places
                    </span>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm rounded-3"
                    @click="openEditCreneau(creneau)"
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm rounded-3"
                    @click="confirmDeleteCreneau(creneau)"
                  >
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreneauRIForm
        v-if="showCreneauForm"
        :campagne-id="campagneId"
        :reunion="reunion"
        :creneau="editingCreneau"
        :creneaux="creneaux"
        @saved="handleCreneauSaved"
        @close="handleCloseCreneauForm"
      />
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

.modal-box-large {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.form-title {
  color: #00313C;
  font-weight: 700;
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
