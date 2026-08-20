<template>
  <div class="d-flex">
    <Sidebar />
    <div class="main-content flex-grow-1">
      <TopBar :breadcrumb="'Détail candidat'" />
      <div class="p-4">
        <button class="btn btn-sm btn-outline-secondary mb-3" @click="router.back()">
          <i class="fa-solid fa-chevron-left"></i> Retour
        </button>
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h3 class="mb-1">{{ candidat.prenom }} {{ candidat.nom }}</h3>
            <p class="text-muted mb-0">{{ candidat.campagne }}</p>
          </div>

          <button
            v-if="typeEntretien"
            class="btn btn-primary"
            @click="effectuerEntretien"
          >
            Effectuer l'entretien
          </button>
        </div>

        <!-- Onglets -->
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item" v-for="tab in tabs" :key="tab.key">
            <button
              class="nav-link"
              :class="{ active: ongletActif === tab.key }"
              @click="ongletActif = tab.key"
            >
              {{ tab.label }}
            </button>
          </li>
        </ul>

        <!-- Contenu des onglets -->
        <div v-if="ongletActif === 'resume'" class="tab-content-panel">
          <p class="text-muted">Aucune information pour le moment.</p>
        </div>

        <div v-else-if="ongletActif === 'academique'" class="tab-content-panel">
          <div class="card-info mb-3" v-for="(parcours, i) in candidat.parcoursAcademique" :key="i">
            <h6>{{ parcours.diplome }}</h6>
            <p class="text-muted mb-1">{{ parcours.etablissement }}</p>
            <p class="text-muted small mb-0">{{ parcours.periode }}</p>
          </div>
        </div>

        <div v-else-if="ongletActif === 'professionnel'" class="tab-content-panel">
          <p class="text-muted">Aucune information pour le moment.</p>
        </div>

        <div v-else-if="ongletActif === 'documents'" class="tab-content-panel">
          <p class="text-muted">Aucun document pour le moment.</p>
        </div>

        <div v-else-if="ongletActif === 'notes'" class="tab-content-panel">
          <p class="text-muted">Aucune note pour le moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'

const route = useRoute()
const router = useRouter()

// type d'entretien passé en query param depuis CandidatsEntretien.vue
// ex: /candidats/12?type=technique&entretienId=1
const typeEntretien = computed(() => route.params.typeEntretien) // ou passer en query
const entretienId = computed(() => route.params.entretienId)

const ongletActif = ref('resume')

const tabs = [
  { key: 'resume', label: 'Résumé' },
  { key: 'academique', label: 'Parcours académique' },
  { key: 'professionnel', label: 'Parcours professionnel' },
  { key: 'documents', label: 'Documents' },
  { key: 'notes', label: 'Notes' },
]

// TODO: remplacer par un appel API getCandidatById(route.params.id)
const candidat = ref({
  id: route.params.id,
  nom: 'Diallo',
  prenom: 'Awa',
  campagne: 'Développeur Full Stack - Promo 2026',
  parcoursAcademique: [
    { diplome: 'Licence en Informatique', etablissement: 'UCAD', periode: '2021 - 2024' },
    { diplome: 'Baccalauréat Scientifique', etablissement: 'Lycée John F. Kennedy', periode: '2018 - 2021' },
  ],
})

function effectuerEntretien() {
  const type = typeEntretien.value === 'technique' ? 'technique' : 'motivation'
  if (type === 'technique') {
    router.push(`/jury/entretiens/${entretienId.value}/candidats/${route.params.candidatId}/technique`)
  } else {
    router.push(`/jury/entretiens/${entretienId.value}/candidats/${route.params.candidatId}/motivation`)
  }
}
</script>

<style scoped>
.card-info {
  background: #fff;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.nav-tabs .nav-link.active {
  font-weight: 600;
  border-bottom: 2px solid #D20C4F;
  color: #D20C4F;
}
.tab-content-panel {
  min-height: 200px;
}
</style>