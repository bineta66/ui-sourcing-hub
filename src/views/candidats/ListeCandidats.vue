<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import CardCandidat from '@/components/CardCandidat.vue'
import Recherche from '@/components/Recherche.vue'
import Filtre from '@/components/Filtre.vue'


const recherche = ref('')
const campagneSelectionnee = ref('')
const currentView = ref('candidats')

const handleViewChange = (newView) => {
  currentView.value = newView
}

const candidats = ref([
  { id: 1, nom: 'Cissé', prenom: 'Sarah', sexe: 'F', telephone: '77 123 45 67', email: 'sarah.cisse@example.com', campagne: 'Développement web / mobile + IA' },
  { id: 2, nom: 'Fall', prenom: 'Mamadou', sexe: 'M', telephone: '76 987 65 43', email: 'm.fall@example.com', campagne: 'Entrepreneuriat' },
])

const campagnesDisponibles = computed(() =>
  [...new Set(candidats.value.map(c => c.campagne))]
)

const candidatsFiltres = computed(() =>
  candidats.value.filter(c => {
    const matchCampagne = !campagneSelectionnee.value || c.campagne === campagneSelectionnee.value
    const matchRecherche = !recherche.value ||
      `${c.nom} ${c.prenom} ${c.email} ${c.telephone} ${c.campagne}`.toLowerCase().includes(recherche.value.toLowerCase())
    return matchCampagne && matchRecherche
  })
)

function resetFiltres() {
  recherche.value = ''
  campagneSelectionnee.value = ''
}
const router = useRouter()

function onVoirPlus(candidat) {
  router.push(`/candidats/${candidat.id}`)
}
</script>

<template>
  <div class="layout">
    <Sidebar
      :active-view="currentView"
      @change-view="handleViewChange"
      @logout="handleLogout"
    />
    <div class="content flex-grow-1">
      <TopBar breadcrumb="Candidates" user-name="Ndeye" user-role="HR SUPERVISOR" />

      <div class="p-4">
        <h2 class="page-title mb-1">Liste des candidats assignés</h2>
        <p class="page-subtitle">Gérer et suivre les candidats tout au long du processus.</p>
        
        
        <div class="d-flex justify-content-between mb-5">
            <Filtre v-model="campagneSelectionnee" :campagnes="campagnesDisponibles" @reset="resetFiltres"/>
            <Recherche v-model="recherche" />
        </div>


        <div class="table-card">
          <table class="table mb-0">
            <thead>
              <tr>
                <th>Candidat</th>
                <th>Sexe</th>
                <th>Téléphone</th>
                <th>Campagne</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <CardCandidat
                v-for="c in candidatsFiltres"
                :key="c.id"
                :candidat="c"
                @voir-plus="onVoirPlus"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', Arial, sans-serif;
  background: #F8FAFC;
}
.content { display: flex; flex-direction: column; }
.page-title { color: #00313C; font-weight: 800; font-size: 1.5rem; }
.page-subtitle { color: #64748B; font-size: 14px; }
.table-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.table-card thead th {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  color: #64748B; border-bottom: 1px solid #E2E8F0; padding: 16px;
}
.table-card tbody td { padding: 16px; }
</style>