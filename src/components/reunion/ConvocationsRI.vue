<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  getCampagneCandidats,
  getReunionConvocations,
  sendReunionConvocations,
  downloadConvocationPdf,
  resendConvocationEmail,
} from '@/api/endpoints/reunionInformation'

const props = defineProps({
  campagneId: { type: Number, required: true },
  reunion: { type: Object, required: true },
  creneaux: { type: Array, default: () => [] },
})

const emit = defineEmits(['updated', 'close'])

const loading = ref(false)
const sending = ref(false)
const candidatsList = ref([])
const convocationsList = ref([])
const selectedCandidatIds = ref([])
const selectedCreneauId = ref(null)
const filterCreneau = ref('all')
const filterStatus = ref('all')
const searchQuery = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const showConfirmModal = ref(false)
const envoyerEmail = ref(true)

// Charger les candidats et les convocations
const fetchData = async () => {
  if (!props.campagneId || !props.reunion?.id) return
  loading.value = true
  errorMessage.value = ''
  try {
    const [candidatsRes, convocationsRes] = await Promise.all([
      getCampagneCandidats(props.campagneId),
      getReunionConvocations(props.reunion.id),
    ])
    candidatsList.value = candidatsRes.data
    convocationsList.value = convocationsRes.data
  } catch (err) {
    errorMessage.value =
      err.response?.data?.detail || 'Erreur lors du chargement des données.'
  } finally {
    loading.value = false
  }
}

// Map pour retrouver rapidement la convocation d'un candidat
const convocationsMap = computed(() => {
  const map = {}
  for (const c of convocationsList.value) {
    map[c.candidature] = c
  }
  return map
})

// Combiner candidat avec sa convocation RI
const enrichedCandidats = computed(() => {
  return candidatsList.value.map((cand) => {
    const conv = convocationsMap.value[cand.id] || cand.convocation_ri || null
    return {
      ...cand,
      convocation: conv,
      hasConvocation: !!conv,
      statutPresence: conv?.statut || 'absent',
      creneauId: conv?.creneau || conv?.creneau_id || null,
      creneauNom: conv?.creneau_nom || null,
      datePresence: conv?.date_presence || null,
      dateEnvoi: conv?.date_envoi || null,
    }
  })
})

// Filtrage
const filteredCandidats = computed(() => {
  return enrichedCandidats.value.filter((item) => {
    // Filtre texte
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const fullName = `${item.prenom} ${item.nom}`.toLowerCase()
      const email = (item.email || '').toLowerCase()
      const tel = (item.telephone || '').toLowerCase()
      if (!fullName.includes(q) && !email.includes(q) && !tel.includes(q)) {
        return false
      }
    }

    // Filtre créneau
    if (filterCreneau.value !== 'all') {
      if (filterCreneau.value === 'none' && item.creneauId !== null) return false
      if (
        filterCreneau.value !== 'none' &&
        item.creneauId !== Number(filterCreneau.value)
      ) {
        return false
      }
    }

    // Filtre statut présence / convocation
    if (filterStatus.value !== 'all') {
      if (filterStatus.value === 'present' && item.statutPresence !== 'present')
        return false
      if (filterStatus.value === 'absent' && item.statutPresence !== 'absent')
        return false
      if (filterStatus.value === 'convoque' && !item.hasConvocation) return false
      if (filterStatus.value === 'non_convoque' && item.hasConvocation)
        return false
    }

    return true
  })
})

// Sélection globale
const isAllSelected = computed(() => {
  if (filteredCandidats.value.length === 0) return false
  return filteredCandidats.value.every((c) =>
    selectedCandidatIds.value.includes(c.id)
  )
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const idsToRemove = new Set(filteredCandidats.value.map((c) => c.id))
    selectedCandidatIds.value = selectedCandidatIds.value.filter(
      (id) => !idsToRemove.has(id)
    )
  } else {
    const currentSet = new Set(selectedCandidatIds.value)
    for (const c of filteredCandidats.value) {
      currentSet.add(c.id)
    }
    selectedCandidatIds.value = Array.from(currentSet)
  }
}

// Statistiques rapides
const statsConvoques = computed(
  () => enrichedCandidats.value.filter((c) => c.hasConvocation).length
)
const statsPresents = computed(
  () => enrichedCandidats.value.filter((c) => c.statutPresence === 'present').length
)
const statsAbsents = computed(
  () => enrichedCandidats.value.filter((c) => c.hasConvocation && c.statutPresence === 'absent').length
)

// Déclenchement de l'envoi
const openSendConfirm = () => {
  if (selectedCandidatIds.value.length === 0) return
  showConfirmModal.value = true
}

const confirmSendConvocations = async () => {
  sending.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const res = await sendReunionConvocations(props.reunion.id, {
      candidature_ids: selectedCandidatIds.value,
      creneau_id: selectedCreneauId.value || null,
      envoyer_email: envoyerEmail.value,
    })
    successMessage.value = `${res.data.total} convocation(s) générée(s) avec succès (${res.data.envoyes} email(s) envoyé(s)).`
    selectedCandidatIds.value = []
    showConfirmModal.value = false
    await fetchData()
    emit('updated')
  } catch (err) {
    errorMessage.value =
      err.response?.data?.detail || "Erreur lors de l'envoi des convocations."
  } finally {
    sending.value = false
  }
}

// Téléchargement du PDF
const handleDownloadPdf = async (convocationId, candidat) => {
  try {
    const { data } = await downloadConvocationPdf(convocationId)
    const blob = new Blob([data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Convocation_RI_${candidat.nom}_${candidat.prenom}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    alert('Erreur lors du téléchargement du PDF de convocation.')
  }
}

// Renvoyer l'email
const handleResendEmail = async (convocationId) => {
  if (!confirm("Voulez-vous renvoyer l'email de convocation à ce candidat ?"))
    return
  try {
    await resendConvocationEmail(convocationId)
    alert('Email de convocation renvoyé avec succès.')
    await fetchData()
  } catch (err) {
    alert("Erreur lors de l'envoi de l'email.")
  }
}

const formatTime = (time) => {
  if (!time) return ''
  return String(time).substring(0, 5)
}

onMounted(() => {
  if (props.creneaux.length > 0) {
    selectedCreneauId.value = props.creneaux[0].id
  }
  fetchData()
})

watch(
  () => props.creneaux,
  (newVal) => {
    if (newVal.length > 0 && !selectedCreneauId.value) {
      selectedCreneauId.value = newVal[0].id
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box modal-box-xl">
      <!-- En-tête -->
      <div class="d-flex justify-content-between align-items-start mb-3 pb-2 border-bottom">
        <div>
          <div class="d-flex align-items-center gap-2">
            <h4 class="form-title mb-0">Gestion des Convocations RI</h4>
            <span class="badge bg-primary rounded-pill">
              {{ reunion.titre || 'Réunion d\'Information' }}
            </span>
          </div>
          <p class="text-muted fs-7 mb-0 mt-1">
            <i class="fa-regular fa-calendar me-1"></i> {{ reunion.date }} &nbsp;|&nbsp;
            <i class="fa-solid fa-location-dot me-1"></i> {{ reunion.lieu }}
          </p>
        </div>
        <button type="button" class="close-button" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Messages alertes -->
      <div v-if="errorMessage" class="alert alert-danger py-2 mb-3">
        <i class="fa-solid fa-triangle-exclamation me-2"></i>{{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success py-2 mb-3">
        <i class="fa-solid fa-circle-check me-2"></i>{{ successMessage }}
      </div>

      <!-- Compteurs Synthèse -->
      <div class="row g-3 mb-4">
        <div class="col-sm-3">
          <div class="p-3 bg-light rounded-4 text-center border">
            <div class="fs-4 fw-black text-dark-blue">{{ candidatsList.length }}</div>
            <div class="fs-8 text-muted fw-bold">TOTAL CANDIDATS</div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="p-3 bg-primary-subtle text-primary rounded-4 text-center border border-primary-subtle">
            <div class="fs-4 fw-black">{{ statsConvoques }}</div>
            <div class="fs-8 fw-bold">CONVOQUÉS</div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="p-3 bg-success-subtle text-success rounded-4 text-center border border-success-subtle">
            <div class="fs-4 fw-black">{{ statsPresents }}</div>
            <div class="fs-8 fw-bold">PRÉSENTS</div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="p-3 bg-warning-subtle text-warning-emphasis rounded-4 text-center border border-warning-subtle">
            <div class="fs-4 fw-black">{{ statsAbsents }}</div>
            <div class="fs-8 fw-bold">ABSENTS / ATTENTE</div>
          </div>
        </div>
      </div>

      <!-- Barre d'action groupée & Filtres -->
      <div class="action-bar-card p-3 rounded-4 bg-light mb-4 border">
        <div class="row g-3 align-items-center">
          <!-- Recherche -->
          <div class="col-md-4">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-white border-end-0">
                <i class="fa-solid fa-magnifying-glass text-muted"></i>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control border-start-0"
                placeholder="Rechercher par nom, email..."
              />
            </div>
          </div>

          <!-- Filtre Créneau -->
          <div class="col-md-3">
            <select v-model="filterCreneau" class="form-select form-select-sm">
              <option value="all">Tous les créneaux</option>
              <option v-for="cr in creneaux" :key="cr.id" :value="cr.id">
                {{ cr.nom || 'Créneau' }} ({{ formatTime(cr.heure_debut) }} - {{ formatTime(cr.heure_fin) }})
              </option>
              <option value="none">Non assignés</option>
            </select>
          </div>

          <!-- Filtre Statut -->
          <div class="col-md-2">
            <select v-model="filterStatus" class="form-select form-select-sm">
              <option value="all">Tous statuts</option>
              <option value="convoque">Convoqués</option>
              <option value="non_convoque">Non convoqués</option>
              <option value="present">Présents</option>
              <option value="absent">Absents</option>
            </select>
          </div>

          <!-- Action d'envoi en masse -->
          <div class="col-md-3 text-end">
            <button
              class="btn btn-pink btn-sm rounded-3 fw-bold w-100"
              :disabled="selectedCandidatIds.length === 0"
              @click="openSendConfirm"
            >
              <i class="fa-solid fa-paper-plane me-1"></i>
              Envoyer ({{ selectedCandidatIds.length }})
            </button>
          </div>
        </div>
      </div>

      <!-- Tableau des candidats -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-2">Chargement des candidats...</p>
      </div>

      <div v-else-if="filteredCandidats.length === 0" class="text-center py-5 text-muted">
        <i class="fa-solid fa-users-slash fs-1 mb-2 opacity-50"></i>
        <p class="mb-0">Aucun candidat correspondant aux filtres.</p>
      </div>

      <div v-else class="table-responsive candidates-table-wrapper rounded-3 border">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 40px;" class="text-center">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th>Candidat</th>
              <th>Contact</th>
              <th>Créneau / Groupe</th>
              <th>Convocation</th>
              <th>Statut Présence</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in filteredCandidats"
              :key="c.id"
              :class="{ 'table-active': selectedCandidatIds.includes(c.id) }"
            >
              <td class="text-center">
                <input
                  v-model="selectedCandidatIds"
                  type="checkbox"
                  class="form-check-input"
                  :value="c.id"
                />
              </td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar-circle-sm bg-primary-subtle text-primary fw-bold">
                    {{ (c.prenom?.[0] || '') + (c.nom?.[0] || '') }}
                  </div>
                  <div>
                    <div class="fw-bold text-dark-blue fs-7">{{ c.prenom }} {{ c.nom }}</div>
                    <div class="text-muted fs-8">ID #{{ c.id }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="fs-7">{{ c.email }}</div>
                <div class="text-muted fs-8">{{ c.telephone || 'Non renseigné' }}</div>
              </td>
              <td>
                <span v-if="c.creneauNom" class="badge bg-info-subtle text-info-emphasis border border-info-subtle">
                  {{ c.creneauNom }}
                </span>
                <span v-else-if="c.convocation?.creneau_heure_debut" class="badge bg-secondary-subtle text-secondary">
                  {{ formatTime(c.convocation.creneau_heure_debut) }} - {{ formatTime(c.convocation.creneau_heure_fin) }}
                </span>
                <span v-else class="badge bg-light text-muted border">
                  Non assigné
                </span>
              </td>
              <td>
                <span v-if="c.hasConvocation" class="badge bg-success-subtle text-success">
                  <i class="fa-solid fa-check me-1"></i> Envoyée
                </span>
                <span v-else class="badge bg-warning-subtle text-warning-emphasis">
                  Non envoyée
                </span>
              </td>
              <td>
                <span
                  class="badge px-2 py-1 rounded-pill"
                  :class="c.statutPresence === 'present' ? 'bg-success text-white' : 'bg-secondary text-white'"
                >
                  {{ c.statutPresence === 'present' ? 'PRÉSENT' : 'ABSENT' }}
                </span>
                <div v-if="c.datePresence" class="fs-8 text-muted mt-1">
                  {{ new Date(c.datePresence).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}
                </div>
              </td>
              <td class="text-end">
                <div v-if="c.hasConvocation" class="d-flex gap-1 justify-content-end">
                  <button
                    class="btn btn-outline-secondary btn-sm"
                    title="Télécharger le PDF"
                    @click="handleDownloadPdf(c.convocation.id, c)"
                  >
                    <i class="fa-solid fa-file-pdf text-danger"></i>
                  </button>
                  <button
                    class="btn btn-outline-primary btn-sm"
                    title="Renvoyer l'email"
                    @click="handleResendEmail(c.convocation.id)"
                  >
                    <i class="fa-solid fa-envelope"></i>
                  </button>
                </div>
                <span v-else class="text-muted fs-8">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmation d'envoi en masse -->
    <div v-if="showConfirmModal" class="modal-overlay modal-nested" @click.self="showConfirmModal = false">
      <div class="modal-box modal-box-sm">
        <h5 class="fw-bold text-dark-blue mb-3">
          <i class="fa-solid fa-paper-plane text-primary me-2"></i>
          Confirmation d'envoi des convocations
        </h5>

        <p class="text-muted fs-7 mb-3">
          Vous allez envoyer les convocations RI à <strong>{{ selectedCandidatIds.length }}</strong> candidat(s).
        </p>

        <div class="mb-3">
          <label class="form-label fs-8 text-muted fw-bold mb-1">Créneau / Groupe à assigner :</label>
          <select v-model="selectedCreneauId" class="form-select form-select-sm">
            <option :value="null">Créneau par défaut / Non spécifié</option>
            <option v-for="cr in creneaux" :key="cr.id" :value="cr.id">
              {{ cr.nom || 'Créneau' }} ({{ formatTime(cr.heure_debut) }} - {{ formatTime(cr.heure_fin) }})
            </option>
          </select>
        </div>

        <div class="form-check mb-4">
          <input
            id="envoyerEmailCheck"
            v-model="envoyerEmail"
            type="checkbox"
            class="form-check-input"
          />
          <label for="envoyerEmailCheck" class="form-check-label fs-7">
            Envoyer immédiatement le PDF avec QR code unique par email aux candidats.
          </label>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-light btn-sm px-3 fw-bold"
            :disabled="sending"
            @click="showConfirmModal = false"
          >
            Annuler
          </button>
          <button
            type="button"
            class="btn btn-pink btn-sm px-4 fw-bold"
            :disabled="sending"
            @click="confirmSendConvocations"
          >
            <span v-if="sending" class="spinner-border spinner-border-sm me-1"></span>
            Confirmer l'envoi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(2px);
}

.modal-nested {
  z-index: 1060;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-box {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.modal-box-xl {
  width: 100%;
  max-width: 960px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-box-sm {
  width: 100%;
  max-width: 480px;
}

.form-title {
  color: #00313c;
  font-weight: 800;
}

.close-button {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
}
.close-button:hover {
  color: #d20c4f;
}

.avatar-circle-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

.candidates-table-wrapper {
  max-height: 420px;
  overflow-y: auto;
}

.fs-7 {
  font-size: 0.875rem;
}
.fs-8 {
  font-size: 0.75rem;
}

.text-dark-blue {
  color: #00313c;
}

.btn-pink {
  background-color: #d20c4f;
  color: #ffffff;
  border: none;
}
.btn-pink:hover {
  background-color: #b00a42;
  color: #ffffff;
}
.btn-pink:disabled {
  background-color: #f3a4be;
  cursor: not-allowed;
}
</style>
