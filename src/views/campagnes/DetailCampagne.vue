<!-- views/DetailCampagne.vue -->

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { getCampagneById } from '@/api/endpoints/campagnes'

const route = useRoute()
const auth = useAuthStore()

const currentView = ref('campagnes')

const handleViewChange = (newView) => {
  currentView.value = newView
}

const handleLogout = () => {
  auth.logout()
  window.location.href = '/login'
}

const campagne = ref({
  nom: '',
  categorie: '',
  description: '',
  referentiel: '',
  dateDebut: '',
  dateFin: '',
  statut: '',
  candidats: 0
})

const criteres = ref([])
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const { data } = await getCampagneById(route.params.id)
    campagne.value = {
      nom: data.title || '',
      categorie: data.referentiel?.title || '',
      description: data.description || '',
      referentiel: data.referentiel?.title || 'Standard de l’entreprise',
      dateDebut: data.begin_date || '',
      dateFin: data.end_date || '',
      statut: data.status ? {
        'brouillon': 'À VENIR',
        'publiee': 'EN PROGRESSION',
        'cloturee': 'PASSÉ'
      }[data.status] || data.status : '',
      candidats: 0
    }
    criteres.value = (data.criteres || []).map((c) => ({
      id: c.id,
      nom: c.name || '',
      description: c.description || ''
    }))
  } catch (err) {
    errorMessage.value = err.response?.data?.detail || 'Erreur lors du chargement'
  } finally {
    loading.value = false
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
                {{ auth.user?.first_name || auth.user?.username || 'Utilisateur' }}
              </div>

              <div class="user-role">
                {{ auth.user?.is_admin ? 'ADMIN' : 'UTILISATEUR' }}
              </div>

            </div>

            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
              alt="Avatar de Ndeye"
              class="user-avatar"
            />

          </div>

        </div>

      </header>


      <!-- =========================
           TITRE
      ========================== -->

      <main class="detail-page" v-if="!loading">

        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <div v-else>

        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3"
        >

          <div>

            <div class="d-flex align-items-center gap-3 mb-2">

              <h1 class="h2 fw-black text-dark-blue mb-0">
                {{ campagne.nom }}
              </h1>

              <span class="badge rounded-pill status-badge">
                {{ campagne.statut }}
              </span>

            </div>

            <p class="text-muted mb-0">
              Détails et informations de la campagne de formation.
            </p>

          </div>

          <!-- Bouton modifier -->

          <router-link
            :to="`/campagnes/update/${route.params.id}`"
            class="btn btn-pink px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2 shadow-sm"
          >
            <i class="fa-regular fa-pen-to-square"></i>

            <span>
              Modifier
            </span>

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
                  {{ campagne.description }}
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
                  {{ campagne.statut }}
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

              <!-- Catégorie -->

              <div class="col-md-6">

                <div class="info-label">
                  Catégorie
                </div>

                <div class="info-value">
                  {{ campagne.categorie }}
                </div>

              </div>


              <!-- Référentiel -->

              <div class="col-md-6">

                <div class="info-label">
                  Référentiel
                </div>

                <div class="info-value">
                  {{ campagne.referentiel }}
                </div>

              </div>


              <!-- Date début -->

              <div class="col-md-6">

                <div class="info-label">
                  Date de début
                </div>

                <div class="info-value d-flex align-items-center gap-2">

                  <i class="fa-regular fa-calendar text-muted"></i>

                  {{ campagne.dateDebut }}

                </div>

              </div>


              <!-- Date fin -->

              <div class="col-md-6">

                <div class="info-label">
                  Date de fin
                </div>

                <div class="info-value d-flex align-items-center gap-2">

                  <i class="fa-regular fa-calendar text-muted"></i>

                  {{ campagne.dateFin }}

                </div>

              </div>


              <!-- Candidats -->

              <div class="col-md-6">

                <div class="info-label">
                  Nombre de candidats
                </div>

                <div class="info-value d-flex align-items-center gap-2">

                  <i class="fa-solid fa-users text-muted"></i>

                  {{ campagne.candidats }}

                  candidats

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
                {{ criteres.length }} critères
              </span>

            </div>


            <!-- Liste des critères -->

            <div class="d-flex flex-column gap-3">

              <div
                v-for="(critere, index) in criteres"
                :key="critere.id"
                class="criterion-card"
              >

                <div class="d-flex align-items-start gap-3">

                  <div class="criterion-number">
                    {{ index + 1 }}
                  </div>

                  <div>

                    <h6 class="fw-bold text-dark-blue mb-1">
                      {{ critere.nom }}
                    </h6>

                    <p class="text-muted fs-7 mb-0">
                      {{ critere.description }}
                    </p>

                  </div>

                </div>

              </div>

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

          <router-link
            to="/campagnes/update/"
            class="btn btn-pink rounded-3 px-4 py-2 fw-bold"
          >
            <i class="fa-regular fa-pen-to-square me-2"></i>
            Modifier la campagne
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

  background-color: #F8FAFC;
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