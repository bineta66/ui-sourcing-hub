<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'

const router = useRouter()

// données mockées, à remplacer par le store/API plus tard
const candidat = {
  nom: 'Cissé',
  prenom: 'Sarah',
  formation: 'Licence 2 - Génie chimique',
  email: 'sarah.cisse@example.com',
  telephone: '+221 77 123 45 67',
  localisation: 'HLM Grand Yoff',
  photo: '',
  enLigne: true,
  parcoursAcademique: [
    { periode: '2023 - 2025', diplome: 'Licence 2 - Génie chimique', etablissement: 'Université Cheikh Anta Diop' },
    { periode: '2020 - 2023', diplome: 'Baccalauréat série S2', etablissement: 'Lycée John F. Kennedy' }
  ]
}

const tabs = [
  { id: 'parcours-academique', label: 'Parcours académique' },
  { id: 'base-informatique', label: 'Bases en informatique' },
  { id: 'documents', label: 'Documents' },
]

const ongletActif = ref('parcours-academique')

function retourDashboard() {
  router.push('/candidats')
}
</script>

<template>
  <div class="layout">
        <Sidebar active-view="candidates" />

        <div class="content flex-grow-1">
        <TopBar back-label="Retourner au Dashboard" @back="retourDashboard" user-name="Ndeye" user-role="HR SUPERVISOR" />

        <div class="p-4 d-flex gap-4">
            <!-- Colonne principale -->
            <div class="main-card flex-grow-1">
            <div class="p-4 d-flex justify-content-between  gap-3 align-items-start">
                <div class="position-relative">
                <img v-if="candidat.photo" :src="candidat.photo" class="candidat-photo" />
                    <div v-else class="candidat-photo-placeholder">
                        {{ candidat.prenom.charAt(0) }}{{ candidat.nom.charAt(0) }}
                    </div>
                    <span v-if="candidat.enLigne" class="online-dot"></span>
                </div>

                <div>
                <h3 class="candidat-nom mb-1">{{ candidat.prenom }} {{ candidat.nom }}</h3>
                <p class="candidat-formation mb-2">{{ candidat.formation }}</p>
                <div class="d-flex gap-3 flex-wrap contact-row">
                    <span><i class="fa-regular fa-envelope me-1"></i>{{ candidat.email }}</span>
                    <span><i class="fa-solid fa-phone me-1"></i>{{ candidat.telephone }}</span>
                    <span><i class="fa-solid fa-location-dot me-1"></i>{{ candidat.localisation }}</span>
                </div>
                </div>
                <!-- Colonne actions rapides -->
                <div class="actions-card">
                    <h6 class="actions-title mb-3">Actions rapides</h6>
                    <button type="button" class="btn action-btn action-btn-outline mb-2">
                        <i class="fa-solid fa-code me-2"></i>Entretien technique
                    </button>
                    <button type="button" class="btn action-btn action-btn-fill">
                        <i class="fa-solid fa-heart me-2"></i>Entretien de motivation
                    </button>
                </div>
            </div>
            <!-- Onglets -->
            <div class="tabs-strip px-2">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                class="tab-btn"
                :class="{ active: ongletActif === tab.id }"
                @click="ongletActif = tab.id"
            >
                {{ tab.label }}
            </button>
            </div>

            <div class="p-4">
            <template v-if="ongletActif === 'parcours-academique'">
                <h5 class="section-title mb-3">Parcours académique</h5>
                <div class="timeline">
                <div v-for="(etape, i) in candidat.parcoursAcademique" :key="i" class="timeline-item">
                    <div class="timeline-periode">{{ etape.periode }}</div>
                    <div class="timeline-diplome">{{ etape.diplome }}</div>
                    <div class="timeline-etablissement">{{ etape.etablissement }}</div>
                </div>
                </div>
            </template>

            <template v-else>
                <p class="text-muted fst-italic">Contenu à venir.</p>
            </template>
            </div>
        </div>

        
    </div>
  </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Ninuto', Arial, sans-serif;
  background: #F8FAFC;
}
.content { display: flex; flex-direction: column; }

.main-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.candidat-photo, .candidat-photo-placeholder {
  width: 72px; 
  height: 72px; 
  border-radius: 50%; 
  object-fit: cover;
}
.candidat-photo-placeholder {
  background-color: #D20C4F; color: #FFFFFF;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 20px;
}
.online-dot {
  position: absolute; bottom: -2px; right: -2px;
  width: 16px; height: 16px; border-radius: 50%;
  background-color: #22C55E; border: 3px solid #FFFFFF;
}

.candidat-nom { color: #00313C; font-weight: 800; }
.candidat-formation { color: #D20C4F; font-weight: 600; font-size: 14px; }
.contact-row { color: #64748B; font-size: 13px; }

.tabs-strip {
  display: flex;
  justify-content: space-around;
  gap: 24px;
  border-bottom: 1px solid #E2E8F0;
}
.tab-btn {
  background: none; border: none; padding: 12px 0;
  color: #94A3B8; font-weight: 600; font-size: 14px;
  border-bottom: 2px solid transparent;
}
.tab-btn.active { color: #D20C4F; border-bottom-color: #D20C4F; }

.section-title { color: #00313C; font-weight: 700; }

.timeline-item {
  border-left: 2px solid #E2E8F0;
  padding: 0 0 16px 16px;
  margin-left: 4px;
}
.timeline-periode { color: #94A3B8; font-size: 12px; font-weight: 700; text-transform: uppercase; }
.timeline-diplome { color: #00313C; font-weight: 700; }
.timeline-etablissement { color: #64748B; font-size: 13px; }

.actions-card {
  width: 35%;
  flex-shrink: 0;
  background-color: #00313C;
  border-radius: 12px;
  padding: 20px;
}
.actions-title { color: #FFFFFF; font-weight: 700; }
.action-btn {
  width: 100%;
  font-weight: 600;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-btn-outline { background-color: #FFFFFF; color: #00313C; }
.action-btn-outline:hover { background-color: #F1F5F9; }
.action-btn-fill { background-color: #D20C4F; color: #FFFFFF; }
.action-btn-fill:hover { background-color: #B00A42; color: #FFFFFF; }
</style>