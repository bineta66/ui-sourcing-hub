<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ReunionInformationForm from './ReunionInformationForm.vue'
import CreneauxRI from './CreneauxRI.vue'
import ConvocationsRI from './ConvocationsRI.vue'
import { getReunionStats, getCreneaux } from '@/api/endpoints/reunionInformation'

const props = defineProps({
  campagneId: { type: Number, required: true },
  reunion: { type: Object, default: null },
  creneauxCount: { type: Number, default: 0 },
})

const emit = defineEmits(['updated'])

const showForm = ref(false)
const showCreneaux = ref(false)
const showConvocations = ref(false)

const stats = ref({
  total: 0,
  present: 0,
  absent: 0,
  creneaux: [],
})
const creneauxList = ref([])

const hasReunion = computed(() => !!props.reunion)

const fetchCardData = async () => {
  if (!props.reunion?.id) return
  try {
    const [statsRes, creneauxRes] = await Promise.all([
      getReunionStats(props.reunion.id),
      getCreneaux(props.reunion.id),
    ])
    stats.value = statsRes.data
    creneauxList.value = creneauxRes.data
  } catch (err) {
    console.error('Erreur chargement stats RI:', err)
  }
}

watch(
  () => props.reunion?.id,
  (newId) => {
    if (newId) {
      fetchCardData()
    }
  },
  { immediate: true }
)

const openCreate = () => {
  showForm.value = true
}

const openEdit = () => {
  showForm.value = true
}

const openCreneaux = () => {
  showCreneaux.value = true
}

const openConvocations = () => {
  showConvocations.value = true
}

const handleSaved = (reunionData) => {
  showForm.value = false
  emit('updated', reunionData)
}

const handleCreneauxUpdated = () => {
  fetchCardData()
  emit('updated')
}

const handleConvocationsUpdated = () => {
  fetchCardData()
  emit('updated')
}

const handleCloseForm = () => {
  showForm.value = false
}

const handleCloseCreneaux = () => {
  showCreneaux.value = false
}

const handleCloseConvocations = () => {
  showConvocations.value = false
}

const formatTime = (time) => {
  if (!time) return ''
  return String(time).substring(0, 5)
}
</script>

<template>
  <div class="card border-0 shadow-sm rounded-5 mb-4">
    <div class="card-body p-4">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 class="fw-black text-dark-blue mb-1">Réunion d'information</h5>
          <p class="text-muted fs-7 mb-0">
            Planifiez, gérez les créneaux, envoyez les convocations et scannez les présences.
          </p>
        </div>

        <div v-if="!hasReunion" class="badge rounded-pill bg-warning text-dark">
          Non planifiée
        </div>

        <div v-else class="badge rounded-pill bg-success text-white">
          Planifiée
        </div>
      </div>

      <div v-if="!hasReunion" class="text-center py-4">
        <i class="fa-regular fa-calendar-xmark fs-1 text-muted mb-3"></i>
        <p class="text-muted mb-3">
          Aucune réunion d'information n'est encore planifiée pour cette campagne.
        </p>
        <button
          type="button"
          class="btn btn-primary rounded-3 px-4 py-2 fw-bold"
          @click="openCreate"
        >
          <i class="fa-solid fa-plus me-2"></i>
          Planifier la RI
        </button>
      </div>

      <div v-else>
        <!-- Informations Générales -->
        <div class="row g-3 mb-3">
          <div class="col-md-3">
            <div class="info-label">Date</div>
            <div class="info-value d-flex align-items-center gap-2">
              <i class="fa-regular fa-calendar text-muted"></i>
              {{ reunion.date }}
            </div>
          </div>

          <div class="col-md-3">
            <div class="info-label">Lieu</div>
            <div class="info-value">
              {{ reunion.lieu }}
            </div>
          </div>

          <div class="col-md-3">
            <div class="info-label">Titre</div>
            <div class="info-value">
              {{ reunion.titre }}
            </div>
          </div>

          <div class="col-md-3">
            <div class="info-label">Créneaux</div>
            <div class="info-value">
              {{ creneauxList.length || creneauxCount }} créneau(x)
            </div>
          </div>
        </div>

        <!-- Statistiques de Présence -->
        <div class="row g-3 mb-4">
          <div class="col-sm-4">
            <div class="p-3 bg-light rounded-4 border text-center">
              <div class="fs-4 fw-black text-dark-blue">{{ stats.total || 0 }}</div>
              <div class="fs-8 text-muted fw-bold">CANDIDATS CONVOQUÉS</div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="p-3 bg-success-subtle text-success rounded-4 border border-success-subtle text-center">
              <div class="fs-4 fw-black">{{ stats.present || 0 }}</div>
              <div class="fs-8 fw-bold">PRÉSENTS</div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="p-3 bg-warning-subtle text-warning-emphasis rounded-4 border border-warning-subtle text-center">
              <div class="fs-4 fw-black">{{ stats.absent || 0 }}</div>
              <div class="fs-8 fw-bold">ABSENTS</div>
            </div>
          </div>
        </div>

        <!-- Aperçu des Créneaux (Groupe matin / soir) -->
        <div v-if="creneauxList.length > 0" class="mb-4">
          <div class="info-label mb-2">Créneaux configurés</div>
          <div class="d-flex flex-wrap gap-2">
            <div
              v-for="cr in creneauxList"
              :key="cr.id"
              class="badge bg-white text-dark-blue border p-2 px-3 rounded-3 d-flex align-items-center gap-2 shadow-sm"
            >
              <i class="fa-solid fa-clock text-primary"></i>
              <strong v-if="cr.nom">{{ cr.nom }} :</strong>
              <span>{{ formatTime(cr.heure_debut) }} - {{ formatTime(cr.heure_fin) }}</span>
              <span class="badge bg-primary-subtle text-primary ms-1">
                {{ cr.nombre_candidats ?? 0 }} candidat(s)
              </span>
            </div>
          </div>
        </div>

        <!-- Boutons d'Action -->
        <div class="d-flex gap-2 flex-wrap align-items-center">
          <router-link
            :to="`/reunions/${reunion.id}/scanner`"
            class="btn btn-pink rounded-3 px-3 py-2 fw-bold text-white shadow-sm"
          >
            <i class="fa-solid fa-camera me-2"></i>
            Scanner les présences
          </router-link>

          <button
            type="button"
            class="btn btn-outline-dark rounded-3 px-3 py-2 fw-bold"
            @click="openConvocations"
          >
            <i class="fa-solid fa-users-line me-2 text-primary"></i>
            Gérer les convocations
          </button>

          <button
            type="button"
            class="btn btn-outline-success rounded-3 px-3 py-2 fw-bold"
            @click="openCreneaux"
          >
            <i class="fa-solid fa-clock me-2"></i>
            Gérer les créneaux
          </button>

          <button
            type="button"
            class="btn btn-outline-primary rounded-3 px-3 py-2 fw-bold"
            @click="openEdit"
          >
            <i class="fa-regular fa-pen-to-square me-2"></i>
            Modifier
          </button>
        </div>
      </div>

      <ReunionInformationForm
        v-if="showForm"
        :campagne-id="campagneId"
        :reunion="reunion"
        @saved="handleSaved"
        @close="handleCloseForm"
      />

      <CreneauxRI
        v-if="showCreneaux"
        :campagne-id="campagneId"
        :reunion="reunion"
        @updated="handleCreneauxUpdated"
        @close="handleCloseCreneaux"
      />

      <ConvocationsRI
        v-if="showConvocations"
        :campagne-id="campagneId"
        :reunion="reunion"
        :creneaux="creneauxList"
        @updated="handleConvocationsUpdated"
        @close="handleCloseConvocations"
      />
    </div>
  </div>
</template>

<style scoped>
.info-label {
  margin-bottom: 6px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #00313c;
  font-size: 14px;
  font-weight: 700;
}

.text-dark-blue {
  color: #00313c;
}

.btn-pink {
  background-color: #d20c4f;
  border-color: #d20c4f;
}
.btn-pink:hover {
  background-color: #b00a42;
  border-color: #b00a42;
}

.fs-7 {
  font-size: 0.875rem;
}
.fs-8 {
  font-size: 0.75rem;
}
</style>

