<!-- views/OffreDashboard.vue -->

<script setup>
import { computed, ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import DeleteCampagne from '@/components/DeleteCampagne.vue'
import { onMounted } from 'vue'
import { useCampagnesStore } from '@/stores/campagnes'

// Récupération des campagnes depuis le store
const campagnesStore = useCampagnesStore()
onMounted(async () => {
  await campagnesStore.fetchCampagnes()
  console.log(campagnesStore.items) 
})

// Valeurs sélectionnées dans les deux <select> de filtre
const filtreProgramme = ref('') // '' = "Tous les programmes"
const filtreStatut = ref('')    // '' = "Tous les statuts"

// Liste unique des titres de campagnes, pour remplir dynamiquement
// le <select> "Nom de programme" (au lieu d'options codées en dur)
const programmesDisponibles = computed(() => {
  const titres = campagnesStore.items.map((c) => c.title)
  return [...new Set(titres)] // Set retire les doublons
})

// Liste des campagnes affichées dans le tableau, après application des filtres
const campagnesFiltrees = computed(() => {
  return campagnesStore.items.filter((campagne) => {
    // Si un filtre "programme" est choisi, la campagne doit correspondre EXACTEMENT
    const matchProgramme = !filtreProgramme.value || campagne.title === filtreProgramme.value

    // Si un filtre "statut" est choisi, la campagne doit correspondre EXACTEMENT
    const matchStatut = !filtreStatut.value || campagne.status === filtreStatut.value

    // Les deux conditions doivent être vraies (ET logique)
    // -> permet de filtrer par programme seul, statut seul, ou les deux ensemble
    return matchProgramme && matchStatut
  })
})

// Réinitialise les filtres (optionnel, pratique à ajouter)
const reinitialiserFiltres = () => {
  filtreProgramme.value = ''
  filtreStatut.value = ''
}

// Calcul du nombre de campagnes
const nombreCampagnes = computed(() => campagnesFiltrees.value.length)

// Campagne publiée
const campagnePublier = computed(() =>
  campagnesStore.items.filter(
    campagne => campagne.status === 'publiee'
  ).length
)
// Campagne clocturé
const campagneClocturer = computed(() =>
  campagnesStore.items.filter(
    campagne => campagne.status === 'cloturee'
  ).length
)
// Campagne en brouillon

const campagneBrouillon = computed(() =>
  campagnesStore.items.filter(
    campagne => campagne.status === 'brouillon'
  ).length
)


const showDeleteModal = ref(false)

const campagneASupprimer = ref(null)

const suppressionEnCours = ref(false)

// Fonction pour ouvrir le modal de suppression
const ouvrirModalSuppression = (campagne) => {

  campagneASupprimer.value = campagne

  showDeleteModal.value = true

}

// Fonction pour fermer le modal de suppression
const fermerModalSuppression = () => {

  if (suppressionEnCours.value) {
    return
  }

  showDeleteModal.value = false

  campagneASupprimer.value = null

}

// Fonction pour confirmer la suppression
const confirmerSuppression = async () => {
  suppressionEnCours.value = true

  try {
    await campagnesStore.supprimerCampagne(campagneASupprimer.value.id)
    showDeleteModal.value = false
    campagneASupprimer.value = null
  } catch (err) {
    console.error('Erreur lors de la suppression de la campagne :', err.response?.data)
    // Optionnel : afficher un message d'erreur à l'utilisateur ici
  } finally {
    suppressionEnCours.value = false
  }
}
// Gestion de la vue active
const currentView = ref('campagnes')

const handleViewChange = (newView) => {
  currentView.value = newView

  // Logique de navigation / redirection si nécessaire
  console.log('Navigation vers :', newView)
}

const handleLogout = () => {
  console.log("Déconnexion de l'utilisateur")
}

// Données fictives pour le tableau des offres
// Mapping centralisé : chaque valeur de statut (côté Django) correspond
// à un libellé affiché + des couleurs de badge
const STATUTS = {
  brouillon: { label: 'Brouillon', bg: '#F3F4F6', color: '#6B7280' },
  publiee:   { label: 'Publiée',   bg: '#DCFCE7', color: '#16A34A' },
  cloturee:  { label: 'Clôturée',  bg: '#FEE2E2', color: '#DC2626' }
}

// Retourne les infos d'affichage pour un statut donné
// -> valeur de secours si le statut est inconnu/absent
const getStatutInfo = (status) => {
  return STATUTS[status] || { label: 'Statut inconnu', bg: '#F3F4F6', color: '#6B7280' }
}

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

        <!-- Partie gauche -->

        <div class="d-flex align-items-center gap-3">

          <span class="page-label">
            Campagnes
          </span>

        </div>


        <!-- Partie droite : profil -->

        <div class="d-flex align-items-center gap-3">

          <!-- Notification -->

          <button
            type="button"
            class="notification-button"
          >
            <i class="fa-regular fa-bell"></i>

            <span class="notification-dot"></span>
          </button>


          <!-- Séparateur -->

          <div class="separator"></div>


          <!-- Profil -->

          <div class="d-flex align-items-center gap-3">

            <div class="user-information">

              <div class="user-name">
                Ndeye
              </div>

              <div class="user-role">
                HR SUPERVISOR
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
           CONTENU DU DASHBOARD
      ========================== -->

      <main class="dashboard-content">


        <!-- =========================
             TITRE + BOUTON
        ========================== -->

        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3"
        >

          <div>

            <h1 class="h2 fw-black text-dark-blue mb-1">
              Liste des offres
            </h1>

            <p class="text-muted mb-0">
              Gérer et suivre les programmes de formation professionnelle actifs.
            </p>

          </div>


          <!-- Bouton ajouter -->

          <router-link
            to="/campagnes/create"
            class="btn btn-pink px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2 shadow-sm"
          >

            <i class="fa-solid fa-circle-plus"></i>

            <span>
              Ajouter une campagne
            </span>

          </router-link>

        </div>


        <!-- =========================
             STAT CARDS
        ========================== -->

        <div class="d-flex gap-4 mb-4 flex-wrap">

          <!-- Offres actives -->

          <div
            class="card card-stat px-4 py-3 border-0 shadow-sm rounded-4"
          >

            <span class="stat-label text-muted fw-extrabold text-uppercase">
              Nombre de Campagnes
            </span>

            <span class="stat-value text-dark-blue fw-black">
              {{ nombreCampagnes }}
            </span>

          </div>


          <!-- Total offres -->

          <div
            class="card card-stat px-4 py-3 border-0 shadow-sm rounded-4"
          >

            <span class="stat-label text-muted fw-extrabold text-uppercase">
              Campagnes publiées
            </span>

            <span class="stat-value text-success fw-black">
              {{ campagnePublier }}
            </span>

          </div>

          <div
            class="card card-stat px-4 py-3 border-0 shadow-sm rounded-4"
          >

            <span class="stat-label text-muted fw-extrabold text-uppercase">
              Campagnes clocturée
            </span>

            <span class="stat-value text-warning fw-black">
              {{ campagneClocturer}}
            </span>

          </div>

          <div
            class="card card-stat px-4 py-3 border-0 shadow-sm rounded-4"
          >

            <span class="stat-label text-muted fw-extrabold text-uppercase">
              Campagnes en brouillon
            </span>

            <span class="stat-value text-danger fw-black">
              {{ campagneBrouillon}}
            </span>

          </div>

        </div>


        <!-- =========================
             BARRE DE FILTRES
        ========================== -->

        <div
          class="bg-white p-3 rounded-3 shadow-sm mb-4 d-flex flex-wrap align-items-center gap-3"
        >

          <!-- Nom programme -->
          <div class="flex-grow-1">
            <select
              v-model="filtreProgramme"
              class="form-select rounded-4 border-light bg-light-subtle fw-bold text-dark-blue"
            >
              <option value="">Tous les programmes</option>
              <option
                v-for="titre in programmesDisponibles"
                :key="titre"
                :value="titre"
              >
                {{ titre }}
              </option>
            </select>
          </div>

          <!-- Statut -->
          <div class="flex-grow-1">
            <select
              v-model="filtreStatut"
              class="form-select rounded-4 border-light bg-light-subtle fw-bold text-dark-blue"
            >
              <option value="">Tous les statuts</option>
              <option value="brouillon">Brouillon</option>
              <option value="publiee">Publiée</option>
              <option value="cloturee">Clôturée</option>
            </select>
          </div>

          <!-- Bouton réinitialiser (optionnel) -->
          <div class="align-self-end">
            <button
              type="button"
              class="btn btn-pink px-4 py-2 rounded-3 fw-bold"
              @click="reinitialiserFiltres"
            >
              Réinitialiser
            </button>
          </div>

        </div>


        <!-- =========================
             TABLEAU DES OFFRES
        ========================== -->

        <div
          class="card border-0 shadow-sm rounded-5 overflow-hidden mb-4"
        >

          <div class="table-responsive">

            <table class="table align-middle mb-0">

              <!-- En-tête -->

              <thead class="bg-light border-bottom">

                <tr>

                  <th
                    class="ps-4 py-3 text-muted text- text-uppercase fs-7 fw-black"
                  >
                    PROGRAMME DE FORMATION
                  </th>

                  <th
                    class="py-3 text-muted text-uppercase fs-7 fw-black"
                  >
                    DESCRIPTION
                  </th>

                  <th
                    class="py-3 text-muted text-uppercase fs-7 fw-black"
                  >
                    DURÉE
                  </th>

                  <th
                    class="text-center py-3 text-muted text-uppercase fs-7 fw-black"
                  >
                    CANDIDATS
                  </th>

                  <th
                    class="py-3 text-muted text-uppercase fs-7 fw-black"
                  >
                    STATUT
                  </th>

                  <th
                    class="py-3 text-muted text-uppercase fs-7 fw-black t"
                  >
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <!-- Corps -->

              <tbody>

                <tr
                  v-for="campagne in campagnesFiltrees"
                  :key="campagne.id"
                >
                  <!-- =========================
                      PROGRAMME
                  ========================== -->

                  <td class="ps-4 py-3">

                    <div class="d-flex align-items-center gap-3">

                      <div>

                        <div
                          class="fw-extrabold text-dark-blue fs-6 lh-sm"
                        >
                          {{ campagne.title || 'Titre non disponible' }}
                        </div>

                      </div>

                    </div>

                  </td>


                  <!-- =========================
                      DESCRIPTION
                  ========================== -->

                  <td
                    class="py-3 text-muted fs-7"
                    style="max-width: 250px;"
                  >
                    {{ campagne.description || 'Aucune description disponible' }}
                  </td>


                  <!-- =========================
                      DUREE
                  ========================== -->

                  <td class="py-3">

                    <div
                      class="fw-bold text-dark-blue fs-7"
                    >
                      {{ campagne.begin_date || 'Dates non disponibles' }}
                    </div>

                    <small
                      class="text-success fw-semibold"
                      style="font-size: 11px;"
                    >
                      {{ campagne.end_date || 'Durée non disponible' }}
                    </small>

                  </td>


                  <!-- =========================
                      CANDIDATS
                  ========================== -->

                  <td class="text-center py-3">

                    <div
                      class="fw-black text-dark-blue fs-5 lh-1"
                    >
                      {{ campagne.candidatesCount || 0 }}
                    </div>

                    <span
                      class="text-muted text-uppercase fw-extrabold"
                      style="font-size: 10px;"
                    >
                      {{ campagne.candidatesDetail || 'CANDIDATS' }}
                    </span>

                  </td>


                  <!-- =========================
                      STATUT
                  ========================== -->

                  <td class="py-3">
                    <span
                      class="badge px-3 py-2 rounded-pill fw-extrabold fs-7"
                      :style="{
                        backgroundColor: getStatutInfo(campagne.status).bg,
                        color: getStatutInfo(campagne.status).color
                      }"
                    >
                      {{ getStatutInfo(campagne.status).label }}
                    </span>
                  </td>


                  <!-- =========================
                      ACTIONS
                  ========================== -->

                  <td class="pe-4 text-end py-3">

                    <div class="d-inline-flex gap-2">

                      <!-- Modifier -->

                      <router-link
                        :to="`/campagnes/update/${campagne.id}`"
                        class="btn btn-light btn-sm rounded-3 shadow-xs text-primary"
                      >
                        <i class="fa-regular fa-pen-to-square"></i>
                      </router-link>


                      <!-- Voir détails -->

                      <router-link
                        :to="`/campagnes/detail/${campagne.id}`"
                        class="btn btn-light btn-sm rounded-3 shadow-xs text-secondary"
                      >
                        <i class="fa-regular fa-eye"></i>
                      </router-link>


                      <!-- Supprimer -->

                      <button
                        type="button"
                        class="btn btn-light btn-sm rounded-3 shadow-xs text-danger"
                        @click="ouvrirModalSuppression(campagne)"
                      >
                        <i class="fa-regular fa-trash-can"></i>
                      </button>

                    </div>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>


          <!-- =========================
               PAGINATION
          ========================== -->

          <div
            class="card-footer bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center"
          >

            <span class="text-muted fs-7">
              Affichage de 1 à 4 sur 12 offres de formation
            </span>


            <div class="d-flex gap-1">

              <button
                class="btn btn-sm btn-light rounded-circle"
                disabled
              >
                <i class="fa-solid fa-chevron-left"></i>
              </button>


              <button
                class="btn btn-sm btn-dark-blue rounded-circle px-3"
              >
                1
              </button>


              <button
                class="btn btn-sm btn-light rounded-circle px-3"
              >
                2
              </button>


              <button
                class="btn btn-sm btn-light rounded-circle px-3"
              >
                3
              </button>


              <button
                class="btn btn-sm btn-light rounded-circle"
              >
                <i class="fa-solid fa-chevron-right"></i>
              </button>

            </div>

          </div>

        </div>


        <!-- =========================
             BOTTOM BANNER
        ========================== -->

        <div class="row g-4">


          <!-- Banner Création IA -->

          <div class="col-lg-8">

            <div
              class="banner-card p-4 p-md-5 rounded-5 text-white d-flex justify-content-between align-items-center position-relative overflow-hidden"
            >

              <div
                class="position-relative z-1"
                style="max-width: 480px;"
              >

                <h3 class="fw-black mb-2">
                  Création en masse d’évaluations
                </h3>

                <p class="text-white-50 fs-7 mb-4">
                  Créer plusieurs formulaires de candidature et questionnaires
                  de formation simultanément à l'aide de modèles alimentés par l'IA.
                </p>

                <button
                  class="btn btn-pink rounded-3 px-4 py-2 fw-bold"
                >
                  Lancer l'assistant de création.
                </button>

              </div>


              <div
                class="banner-icon-bg d-none d-md-flex align-items-center justify-content-center"
              >

                <i class="fa-solid fa-bolt fs-1 text-white"></i>

              </div>

            </div>

          </div>


          <!-- Card Exporter -->

          <div class="col-lg-4">

            <div
              class="card h-100 border-0 shadow-sm rounded-5 p-4 text-center d-flex flex-column justify-content-center align-items-center"
            >

              <div
                class="export-icon-box mb-3 d-flex align-items-center justify-content-center"
              >

                <i
                  class="fa-solid fa-file-export text-pink fs-4"
                ></i>

              </div>


              <h5 class="fw-black text-dark-blue mb-2">
                Exporter les données de l'offre
              </h5>


              <p class="text-muted fs-7 mb-4">
                Télécharger toutes les métriques des offres de formation
                au format CSV ou PDF.
              </p>


              <button
                class="btn btn-outline-dark-blue rounded-3 w-100 py-2 fw-bold"
              >
                Télécharger les rapports
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
    <DeleteCampagne
      v-if="showDeleteModal && campagneASupprimer"
      :campagne="campagneASupprimer"
      :suppression-en-cours="suppressionEnCours"
      @cancel="fermerModalSuppression"
      @confirm="confirmerSuppression"
    />

  </div>

</template>


<style scoped>

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.0/css/all.min.css');

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap');


/* =========================================
   GLOBAL
========================================= */

* {
  font-family: 'Nunito Sans', sans-serif;
}


/* =========================================
   LAYOUT
========================================= */

.app-layout {
  min-height: 100vh;

  display: flex;

  background-color: #F8FAFC;
}

.main-content {
  flex: 1;

  min-width: 0;

  background-color: #F8FAFC;
}


/* =========================================
   TOPBAR
   Même style que ModifierCampagne.vue
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
   CONTENU DASHBOARD
========================================= */

.dashboard-content {
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

.bg-dark-blue {
  background-color: #00313C;
}

.btn-dark-blue {
  background-color: #00313C;

  color: white;

  border: none;
}

.btn-dark-blue:hover {
  background-color: #00222a;

  color: white;
}

.btn-outline-dark-blue {
  border: 2px solid #00313C;

  color: #00313C;

  background: transparent;
}

.btn-outline-dark-blue:hover {
  background-color: #00313C;

  color: white;
}

.text-pink {
  color: #D20C4F;
}

.btn-pink {
  background-color: #D20C4F;

  color: white;

  border: none;
}

.btn-pink:hover {
  background-color: #b00a42;

  color: white;
}


/* =========================================
   TYPOGRAPHIE
========================================= */

.fw-black {
  font-weight: 900;
}

.fw-extrabold {
  font-weight: 800;
}

.fs-7 {
  font-size: 13px;
}


/* =========================================
   STAT CARDS
========================================= */

.card-stat {
  min-width: 220px;
}

.stat-label {
  font-size: 10px;

  letter-spacing: 1px;
}

.stat-value {
  font-size: 28px;

  line-height: 1.2;
}


/* =========================================
   TABLEAU
========================================= */

.icon-box {
  width: 48px;
  height: 48px;

  flex-shrink: 0;
}

.badge-cat {
  font-size: 10px;

  letter-spacing: 0.5px;
}


/* =========================================
   BANNER
========================================= */

.banner-card {
  background-color: #00313C;

  min-height: 200px;
}

.banner-icon-bg {
  width: 90px;
  height: 90px;

  background-color: rgba(255, 255, 255, 0.1);

  border-radius: 50%;
}


/* =========================================
   EXPORT
========================================= */

.export-icon-box {
  width: 56px;
  height: 56px;

  background-color: #FDF2F5;

  border-radius: 16px;
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

  .dashboard-content {
    padding: 24px 12px;
  }

}

</style>