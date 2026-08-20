<!-- views/DetailCampagne.vue -->

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useCampagneStore } from '@/stores/campagnes'
import { useAuthStore } from '@/stores/auth'
import { getReunionInformation, getCreneaux } from '@/api/endpoints/reunionInformation'
import ReunionInformationCard from '@/components/reunion/ReunionInformationCard.vue'

// Récupération de l'identifiant de la campagne depuis la route
const route = useRoute()
const campagneId = route.params.id

// Initialisation des stores Pinia
const campagneStore = useCampagneStore()
const authStore = useAuthStore()

const currentView = ref('campagnes')
const reunion = ref(null)
const creneauxCount = ref(0)

const handleViewChange = (newView) => {
  currentView.value = newView
}

const handleLogout = () => {
  window.location.href = '/login'
}

const fetchCreneauxCount = async (reunionId) => {
  if (!reunionId) {
    creneauxCount.value = 0
    return
  }
  try {
    const { data } = await getCreneaux(reunionId)
    creneauxCount.value = data.length
  } catch {
    creneauxCount.value = 0
  }
}

const fetchReunion = async () => {
  if (!campagneId) return
  try {
    const { data } = await getReunionInformation(Number(campagneId))
    reunion.value = data
    await fetchCreneauxCount(data.id)
  } catch (err) {
    if (err.response?.status === 404) {
      reunion.value = null
      creneauxCount.value = 0
    }
  }
}

const handleReunionUpdated = (reunionData) => {
  if (reunionData) {
    reunion.value = reunionData
    fetchCreneauxCount(reunionData.id)
  } else {
    fetchReunion()
  }
}

// Au chargement du composant, récupération de la campagne depuis l'API via le store
onMounted(async () => {
  if (campagneId) {
    try {
      await campagneStore.getCampagne(campagneId)
    } catch (err) {
      console.error('Erreur lors de la récupération de la campagne :', err)
    }
    fetchReunion()
  }
})
</script>
<template>

  <div class="app-layout">

    <!-- =========================
         SIDEBAR
    ========================== -->

    <Sidebar
      :active-view="currentView"
      @change-view="handleViewChange"
      @logout="handleLogout"
    />

    <!-- =========================
         CONTENU PRINCIPAL
    ========================== -->

    <div class="main-content">

      <!-- =========================
           TOPBAR
      ========================== -->

      <header class="topbar">

        <div class="d-flex align-items-center gap-3">

          <router-link
            to="/campagnes"
            class="btn btn-link text-secondary p-0 back-button"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </router-link>

          <span class="page-label">
            Détails de la campagne
          </span>

        </div>

        <!-- Profil -->

        <div class="d-flex align-items-center gap-3">

          <button
            type="button"
            class="notification-button"
          >
            <i class="fa-regular fa-bell"></i>
            <span class="notification-dot"></span>
          </button>

          <div class="separator"></div>

          <div class="d-flex align-items-center gap-3">

            <div class="user-information">

              <div class="user-name">
                {{ authStore.displayName }}
              </div>

              <div class="user-role">
                {{ authStore.userRole || 'Administrateur' }}
              </div>

            </div>

            <img
              :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.displayName)}&background=D20C4F&color=fff&size=36`"
              :alt="authStore.displayName"
              class="user-avatar"
            />

          </div>

        </div>

      </header>


      <!-- Indicateur de chargement -->
      <div v-if="campagneStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2 text-muted">Chargement des détails de la campagne...</p>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="campagneStore.error" class="alert alert-danger m-4">
        {{ campagneStore.error.message || campagneStore.error }}
      </div>

      <!-- Contenu de la campagne -->
      <main class="detail-page" v-else-if="campagneStore.campagneActive">

        <div>

        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3"
        >

          <div>

            <div class="d-flex align-items-center gap-3 mb-2">

              <h1 class="h2 fw-black text-dark-blue mb-0">
                {{ campagneStore.campagneActive.title }}
              </h1>

              <span class="badge rounded-pill status-badge">
                {{ campagneStore.campagneActive.status }}
              </span>

            </div>

            <p class="text-muted mb-0">
              Détails et informations de la campagne de formation.
            </p>

          </div>

          <!-- Bouton modifier -->

          <router-link
            :to="`/campagnes/update/${route.params.id}`"
            class="btn btn-pink rounded-3 px-4 py-2 fw-bold"
          >
            <i class="fa-regular fa-pen-to-square"></i>
            Modifier la campagne
          </router-link>
        </div>


        <!-- =========================
             INFORMATIONS GENERALES
        ========================== -->

        <div class="row g-4 mb-4">

          <!-- Description -->

          <div class="col-lg-8">

            <div class="card border-0 shadow-sm rounded-5 h-100">

              <div class="card-body p-4">

                <h5 class="fw-black text-dark-blue mb-3">
                  Description
                </h5>

                <p class="text-muted mb-0">
                  {{ campagneStore.campagneActive.description }}
                </p>

              </div>

            </div>

          </div>


          <!-- Statut -->

          <div class="col-lg-4">

            <div class="card border-0 shadow-sm rounded-5 h-100">

              <div class="card-body p-4">

                <h5 class="fw-black text-dark-blue mb-4">
                  Statut
                </h5>

                <span class="badge rounded-pill status-badge mb-3">
                  {{ campagneStore.campagneActive.status }}
                </span>

                <p class="text-muted fs-7 mb-0">
                  Cette campagne est actuellement
                  disponible pour les prochaines inscriptions.
                </p>

              </div>

            </div>

          </div>

        </div>


        <!-- =========================
             PARAMETRES
        ========================== -->

        <div class="card border-0 shadow-sm rounded-5 mb-4">

          <div class="card-body p-4">

            <h5 class="fw-black text-dark-blue mb-4">
              Informations de la campagne
            </h5>

            <div class="row g-4">

              <!-- Référentiel -->

              <div class="col-md-6">

                <div class="info-label">
                  Référentiel
                </div>

                <div class="info-value">
                  {{ campagneStore.campagneActive.referentiel?.title || 'Aucun référentiel' }}
                </div>

              </div>


              <!-- Date début -->

              <div class="col-md-6">

                <div class="info-label">
                  Date de début
                </div>

                <div class="info-value d-flex align-items-center gap-2">
                  <i class="fa-regular fa-calendar text-muted"></i>
                  {{ campagneStore.campagneActive.begin_date }}
                </div>

              </div>


              <!-- Date fin -->

              <div class="col-md-6">

                <div class="info-label">
                  Date de fin
                </div>

                <div class="info-value d-flex align-items-center gap-2">

                  <i class="fa-regular fa-calendar text-muted"></i>

                  {{ campagneStore.campagneActive.end_date }}

                </div>

              </div>


              <!-- Candidats -->

              <div class="col-md-6">

                <div class="info-label">
                  Nombre de candidats
                </div>

                <div class="info-value d-flex align-items-center gap-2">

                  <i class="fa-solid fa-users text-muted"></i>

                  {{ campagneStore.campagneActive.nombre_candidatures ?? campagneStore.campagneActive.candidatures?.length ?? 0 }} candidat{{ (campagneStore.campagneActive.nombre_candidatures ?? campagneStore.campagneActive.candidatures?.length ?? 0) > 1 ? 's' : '' }}

                </div>

              </div>

            </div>

          </div>

        </div>


        <!-- =========================
             CRITERES D'EVALUATION
        ========================== -->

        <div class="card border-0 shadow-sm rounded-5 mb-4">

          <div class="card-body p-4">

            <div
              class="d-flex justify-content-between align-items-center mb-4"
            >

              <div>

                <h5 class="fw-black text-dark-blue mb-1">
                  Critères d'évaluation
                </h5>

                <p class="text-muted fs-7 mb-0">
                  Critères utilisés pour l'évaluation des candidats.
                </p>

              </div>

              <span class="criteria-count">
                {{ campagneStore.campagneActive.criteres?.length || 0 }} critères
              </span>

            </div>


            <!-- Liste des critères -->

           <div class="d-flex flex-column gap-3">
              <div
                v-for="(critere, index) in campagneStore.campagneActive.criteres"
                :key="critere.id"
                class="criterion-card"
              >
                <div class="d-flex align-items-start gap-3">
                  <div class="criterion-number">{{ index + 1 }}</div>
                  <div>
                    <h6 class="fw-bold text-dark-blue mb-1">{{ critere.name }}</h6>
                    <p class="text-muted fs-7 mb-0">{{ critere.description }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>


        <!-- =========================
             REUNION D'INFORMATION
        ========================== -->

        <ReunionInformationCard
          :campagne-id="Number(route.params.id)"
          :reunion="reunion"
          :creneaux-count="creneauxCount"
          @updated="handleReunionUpdated"
        />


        <!-- =========================
             FORMULAIRE DE CANDIDATURE
        ========================== -->

        <div class="card border-0 shadow-sm rounded-5 mb-4">

          <div class="card-body p-4">

            <div class="d-flex justify-content-between align-items-center mb-4">

              <div>

                <h5 class="fw-black text-dark-blue mb-1">
                  Formulaire de candidature
                </h5>

                <p class="text-muted fs-7 mb-0">
                  Construisez le formulaire que les candidats rempliront.
                </p>

              </div>

              <router-link
                :to="`/form-builder/${route.params.id}`"
                class="btn btn-pink rounded-3 px-4 py-2 fw-bold"
              >
                <i class="fa-regular fa-pen-to-square"></i>
                {{ campagneStore.campagneActive.formulaire ? 'Modifier le formulaire' : 'Créer le formulaire' }}
              </router-link>

            </div>

            <div v-if="campagneStore.campagneActive.formulaire" class="row g-4">

              <div class="col-md-6">

                <div class="info-label">
                  Titre
                </div>

                <div class="info-value">
                  {{ campagneStore.campagneActive.formulaire.titre || 'Sans titre' }}
                </div>

              </div>

              <div class="col-md-6">

                <div class="info-label">
                  Statut
                </div>

                <div class="info-value d-flex align-items-center gap-2">

                  <span class="badge rounded-pill" :class="campagneStore.campagneActive.formulaire.publier ? 'bg-success' : 'bg-warning'">
                    {{ campagneStore.campagneActive.formulaire.publier ? 'Publié' : 'Brouillon' }}
                  </span>

                  <span v-if="!campagneStore.campagneActive.formulaire.actif" class="badge rounded-pill bg-secondary">
                    Désactivé
                  </span>

                </div>

              </div>

            </div>

            <div v-else class="text-center py-4">

              <i class="bi bi-file-earmark-text fs-1 text-muted d-block mb-3"></i>

              <p class="text-muted mb-0">
                Aucun formulaire n'a encore été créé pour cette campagne.
              </p>

            </div>

          </div>

        </div>


        <!-- =========================
             ACTIONS
        ========================== -->

        <div class="d-flex justify-content-end gap-2 mb-4">

          <router-link
            to="/campagnes"
            class="btn btn-light rounded-3 px-4 py-2 fw-bold"
          >
            Retour
          </router-link>

        </div>

        </div>

      </main>

    </div>

  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.0/css/all.min.css');

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap');


/* =========================================
   LAYOUT
========================================= */

.app-layout {
  min-height: 100vh;
  display: flex;
  background-color: #ffffff;
  font-family: 'Nunito Sans', sans-serif;
}

.main-content {
  flex: 1;
  min-width: 0;
  background-color: #ffffff;
}


/* =========================================
   TOPBAR
   Même topbar que ModifierCampagne.vue
========================================= */

.topbar {
  height: 72px;
  padding: 0 32px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #ffffff;

  border-bottom: 1px solid #E2E8F0;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.page-label {
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
}

.back-button {
  font-size: 18px;
  text-decoration: none;
}

.back-button:hover {
  color: #00313C !important;
}

.notification-button {
  width: 40px;
  height: 40px;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: white;

  border: 1px solid #E2E8F0;
  border-radius: 12px;

  color: #64748B;
}

.notification-dot {
  width: 8px;
  height: 8px;

  position: absolute;
  top: 7px;
  right: 7px;

  background-color: #D20C4F;

  border: 2px solid white;
  border-radius: 50%;
}

.separator {
  width: 1px;
  height: 32px;

  background-color: #E2E8F0;
}

.user-information {
  text-align: right;
}

.user-name {
  color: #1E293B;
  font-size: 14px;
  font-weight: 700;
}

.user-role {
  color: #64748B;
  font-size: 11px;
  font-weight: 500;
}

.user-avatar {
  width: 40px;
  height: 40px;

  object-fit: cover;

  border-radius: 12px;

  box-shadow: 0 0 0 4px #F9FAFB;
}


/* =========================================
   CONTENU DETAIL
========================================= */

.detail-page {
  min-height: calc(100vh - 72px);

  padding: 32px;

  background-color: #FFFFFF;
}


/* =========================================
   COULEURS
========================================= */

.text-dark-blue {
  color: #00313C;
}

.btn-pink {
  background-color: #D20C4F;
  color: white;
  border: none;
}

.btn-pink:hover {
  background-color: #B00A42;
  color: white;
}


/* =========================================
   STATUT
========================================= */

.status-badge {
  background-color: #FEF3C7;
  color: #D97706;

  padding: 8px 14px;

  font-size: 11px;
  font-weight: 800;
}


/* =========================================
   INFORMATIONS
========================================= */

.info-label {
  margin-bottom: 6px;

  color: #94A3B8;

  font-size: 11px;
  font-weight: 800;

  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #00313C;

  font-size: 14px;
  font-weight: 700;
}


/* =========================================
   CRITERES
========================================= */

.criteria-count {
  padding: 7px 12px;

  background-color: #F1F5F9;

  border-radius: 20px;

  color: #64748B;

  font-size: 12px;
  font-weight: 700;
}

.criterion-card {
  padding: 16px;

  background-color: #F8FAFC;

  border: 1px solid #E2E8F0;

  border-radius: 12px;
}

.criterion-number {
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #FDF2F5;

  border-radius: 10px;

  color: #D20C4F;

  font-weight: 900;
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 768px) {

  .topbar {
    padding: 0 16px;
  }

  .user-information {
    display: none;
  }

  .detail-page {
    padding: 24px 12px;
  }

}

</style>