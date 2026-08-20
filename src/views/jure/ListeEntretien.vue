<template>
  <div class="d-flex">
    <Sidebar />
    <div class="main-content flex-grow-1">
      <Topbar :breadcrumb="'Mes entretiens'" />
      <div class="p-4">
        <h3 class="mb-4">Mes entretiens</h3>
        <div v-if="store.loading">Chargement...</div>
        <div v-else>
          <div class="row g-3">
            <div class="col-md-4" v-for="entretien in paginatedEntretiens" :key="entretien.id">
              <CardEntretien :entretien="entretien" @click="goToCandidats(entretien.id)" />
            </div>
          </div>
          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center mt-5" v-if="totalPages > 1">
            <div class="text-muted">
              Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, store.entretiens.length) }} sur {{ store.entretiens.length }} entretiens
            </div>
            <div class="pagination-controls">
              <button
                class="btn btn-sm btn-outline-secondary me-1"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <i class="fa-solid fa-chevron-left"></i>
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
                @click="currentPage++"
              >
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEntretiensStore } from '@/stores/entretienJure'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import CardEntretien from '@/components/entrtien_jure/CardEntretien.vue'

const store = useEntretiensStore()
const router = useRouter()

const currentPage = ref(1)
const itemsPerPage = ref(6)

// TODO: remplacer par l'id du juré connecté (auth store)
const jureId = 3

const totalPages = computed(() => Math.ceil(store.entretiens.length / itemsPerPage.value) || 1)

const paginatedEntretiens = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return store.entretiens.slice(start, start + itemsPerPage.value)
})

onMounted(() => store.fetchEntretiens(jureId))

function goToCandidats(entretienId) {
  router.push(`/jury/entretiens/${entretienId}/candidats`)
}
</script>