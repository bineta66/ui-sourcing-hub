<template>
  <div class="d-flex">
    <Sidebar />
    <div class="main-content flex-grow-1">
      <TopBar :breadcrumb="'Candidats — ' + (entretien?.campagneNom ?? '...')" />
      <div class="p-4">
        <button class="btn btn-sm btn-outline-secondary mb-3" @click="router.back()">
          <i class="fa-solid fa-chevron-left"></i> Retour
        </button>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="mb-0">
            Candidats — {{ entretien?.type === 'technique' ? 'Entretien technique' : 'Entretien motivation' }}
          </h3>
          <div class="filter-status">
            <select v-model="filterStatus" class="form-select form-select-sm" style="width: 180px">
              <option value="">Tous les états</option>
              <option value="afaire">À faire</option>
              <option value="encours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Nom</th><th>Prénom</th><th>Sexe</th><th>Téléphone</th><th>Email</th><th>État</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredCandidats.length === 0" class="text-center">
              <td colspan="7" class="py-4 text-muted">
                <i class="fa-solid fa-inbox fs-2 d-block mb-2"></i>
                Aucun candidat ne correspond à vos filtres.
              </td>
            </tr>
            <tr v-for="c in paginatedCandidats" :key="c.id">
              <td>{{ c.nom }}</td>
              <td>{{ c.prenom }}</td>
              <td>{{ c.sexe }}</td>
              <td>{{ c.telephone }}</td>
              <td>{{ c.email }}</td>
              <td>
                <span 
                  class="badge" 
                  :class="statusBadgeClass(getStatus(c.id))"
                >
                  {{ statusLabel(getStatus(c.id)) }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-secondary me-2" @click="voirDetails(c.id)">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button 
                  class="btn btn-sm btn-primary" 
                  @click="effectuerEntretien(c.id)"
                  :disabled="isEntretienComplete(c.id)"
                  :title="isEntretienComplete(c.id) ? 'Cet entretien est déjà complété' : 'Effectuer l\'entretien'"
                >
                  {{ isEntretienComplete(c.id) ? '✓ Complété' : 'Effectuer l\'entretien' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mt-4" v-if="totalPages > 1">
          <div class="text-muted">
            Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, filteredCandidats.length) }} sur {{ filteredCandidats.length }} candidats
          </div>
          <div class="pagination-controls">
            <button
              class="btn btn-sm btn-outline-secondary me-1"
              :disabled="currentPage === 1"
              @click="currentPage = 1"
              title="Première page"
            >
              <i class="fa-solid fa-chevron-left fa-2x"></i>
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="btn btn-sm me-1"
              :class="currentPage === page ? 'btn-primary' : 'btn-outline-primary'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button
              class="btn btn-sm btn-outline-secondary"
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
              title="Dernière page"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEntretiensStore } from '@/stores/entretienJure'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'

const route = useRoute()
const router = useRouter()
const store = useEntretiensStore()

const entretien = computed(() => store.entretienCourant)
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredCandidats = computed(() => {
  if (!filterStatus.value) return store.candidatsEntretien
  return store.candidatsEntretien.filter(c => getStatus(c.id) === filterStatus.value)
})

const totalPages = computed(() => Math.ceil(filteredCandidats.value.length / itemsPerPage.value) || 1)

const paginatedCandidats = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredCandidats.value.slice(start, start + itemsPerPage.value)
})

const getStatus = (candidatId) => {
  return store.getEntretienStatus(route.params.entretienId, candidatId, entretien.value?.type)
}

const statusLabel = (status) => {
  const labels = { afaire: 'À faire', encours: 'En cours', termine: 'Terminé' }
  return labels[status] || status
}

const statusBadgeClass = (status) => {
  const classes = {
    afaire: 'bg-warning text-dark',
    encours: 'bg-info text-white',
    termine: 'bg-success text-white'
  }
  return classes[status] || 'bg-secondary'
}

const isEntretienComplete = (candidatId) => {
  return store.isEntretienComplete(route.params.entretienId, candidatId, entretien.value?.type)
}

onMounted(() => store.fetchEntretienEtCandidats(route.params.entretienId))

function voirDetails(candidatId) {
  router.push({
    path: `/jury/entretiens/${route.params.entretienId}/candidats/${candidatId}`,
    query: { type: entretien.value?.type }
  })
}

function effectuerEntretien(candidatId) {
  const type = entretien.value?.type
  store.markEntretienEnCours(route.params.entretienId, candidatId, type)
  if (type === 'technique') {
    router.push(`/jury/entretiens/${route.params.entretienId}/candidats/${candidatId}/technique`)
  } else {
    router.push(`/jury/entretiens/${route.params.entretienId}/candidats/${candidatId}/motivation`)
  }
}
</script>