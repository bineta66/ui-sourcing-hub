<!-- views/DeleteCampagne.vue -->

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()


// =========================================
// SIDEBAR
// =========================================

const currentView = ref('campagnes')

const handleViewChange = (newView) => {
  currentView.value = newView

  console.log('Navigation vers :', newView)
}

const handleLogout = () => {
  console.log("Déconnexion de l'utilisateur")
}


// =========================================
// CAMPAGNE À SUPPRIMER
// =========================================

const campagne = ref({
  id: 1,

  nom: 'Introduction à l’infrastructure cloud',

  categorie: 'FORMATION TECHNIQUE',

  description:
    'Fondamentaux des modèles d’architecture AWS et Azure pour débutants.',

  candidats: 42
})


// =========================================
// ETAT DE LA SUPPRESSION
// =========================================

const suppressionEnCours = ref(false)


// =========================================
// ANNULER
// =========================================

const annulerSuppression = () => {
  router.push('/campagnes')
}


// =========================================
// CONFIRMER LA SUPPRESSION
// =========================================

const confirmerSuppression = () => {

  suppressionEnCours.value = true

  /*
   * Ici, tu feras plus tard ton appel API.
   *
   * Exemple :
   *
   * await axios.delete(`/api/campagnes/${campagne.value.id}`)
   */

  console.log(
    'Campagne supprimée :',
    campagne.value.id
  )

  // Simulation de suppression
  setTimeout(() => {

    suppressionEnCours.value = false

    router.push('/campagnes')

  }, 800)
}

</script>


<template>

  <div class="app-layout">


    <!-- =========================================
         SIDEBAR
    ========================================== -->

    <Sidebar
      :active-view="currentView"
      @change-view="handleViewChange"
      @logout="handleLogout"
    />


    <!-- =========================================
         CONTENU PRINCIPAL
    ========================================== -->

    <div class="main-content">


      <!-- =========================================
           TOPBAR
           Même topbar que DetailCampagne.vue
      ========================================== -->

      <header class="topbar">


        <!-- Partie gauche -->

        <div class="d-flex align-items-center gap-3">

          <button
            type="button"
            class="back-button"
            @click="annulerSuppression"
          >

            <i class="fa-solid fa-arrow-left"></i>

          </button>


          <span class="page-label">
            Suppression de campagne
          </span>

        </div>


        <!-- Partie droite -->

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


      <!-- =========================================
           CONTENU
      ========================================== -->

      <main class="delete-page">


        <!-- =========================================
             MODAL
        ========================================== -->

        <div class="modal-overlay">


          <div class="delete-modal">


            <!-- =====================================
                 ICÔNE
            ====================================== -->

            <div class="delete-icon">

              <i class="fa-regular fa-trash-can"></i>

            </div>


            <!-- =====================================
                 TITRE
            ====================================== -->

            <h1 class="delete-title">
              Supprimer cette campagne ?
            </h1>


            <!-- =====================================
                 MESSAGE
            ====================================== -->

            <p class="delete-description">

              Vous êtes sur le point de supprimer définitivement
              la campagne :

            </p>


            <!-- =====================================
                 NOM CAMPAGNE
            ====================================== -->

            <div class="campaign-preview">

              <div class="campaign-preview-icon">

                <i class="fa-solid fa-cloud"></i>

              </div>


              <div class="campaign-preview-content">

                <div class="campaign-name">

                  {{ campagne.nom }}

                </div>

                <div class="campaign-category">

                  {{ campagne.categorie }}

                </div>

              </div>

            </div>


            <!-- =====================================
                 AVERTISSEMENT
            ====================================== -->

            <div class="warning-message">

              <i class="fa-solid fa-circle-exclamation"></i>

              <span>
                Cette action est définitive. Toutes les informations
                associées à cette campagne seront supprimées.
              </span>

            </div>


            <!-- =====================================
                 ACTIONS
            ====================================== -->

            <div class="modal-actions">


              <!-- Annuler -->

              <button
                type="button"
                class="btn-cancel"
                :disabled="suppressionEnCours"
                @click="annulerSuppression"
              >

                Annuler

              </button>


              <!-- Supprimer -->

              <button
                type="button"
                class="btn-delete"
                :disabled="suppressionEnCours"
                @click="confirmerSuppression"
              >

                <span
                  v-if="suppressionEnCours"
                  class="spinner-border spinner-border-sm"
                  aria-hidden="true"
                ></span>

                <i
                  v-else
                  class="fa-regular fa-trash-can"
                ></i>

                <span>

                  {{
                    suppressionEnCours
                      ? 'Suppression...'
                      : 'Supprimer la campagne'
                  }}

                </span>

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>

  </div>

</template>


<style scoped>

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.0/css/all.min.css');

@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap');


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


/* =========================================
   RETOUR
========================================= */

.back-button {
  width: 40px;
  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  background-color: transparent;

  border: none;

  border-radius: 10px;

  color: #64748B;

  font-size: 18px;

  cursor: pointer;

  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #F1F5F9;

  color: #00313C;
}


/* =========================================
   PAGE LABEL
========================================= */

.page-label {
  color: #64748B;

  font-size: 14px;

  font-weight: 500;
}


/* =========================================
   NOTIFICATION
========================================= */

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

  cursor: pointer;
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


/* =========================================
   SEPARATEUR
========================================= */

.separator {
  width: 1px;
  height: 32px;

  background-color: #E2E8F0;
}


/* =========================================
   UTILISATEUR
========================================= */

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
   PAGE DELETE
========================================= */

.delete-page {
  min-height: calc(100vh - 72px);

  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 32px;

  background-color: #F8FAFC;
}


/* =========================================
   OVERLAY
========================================= */

.modal-overlay {
  position: absolute;

  inset: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 24px;

  background-color: rgba(15, 23, 42, 0.35);
}


/* =========================================
   MODAL
========================================= */

.delete-modal {
  width: 100%;

  max-width: 500px;

  padding: 32px;

  background-color: #ffffff;

  border-radius: 24px;

  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.18);

  animation: modalAppear 0.2s ease-out;
}


/* =========================================
   ANIMATION
========================================= */

@keyframes modalAppear {

  from {
    opacity: 0;

    transform: translateY(10px) scale(0.98);
  }

  to {
    opacity: 1;

    transform: translateY(0) scale(1);
  }

}


/* =========================================
   ICON DELETE
========================================= */

.delete-icon {
  width: 64px;
  height: 64px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin: 0 auto 20px;

  background-color: #FDF2F5;

  border-radius: 18px;

  color: #D20C4F;

  font-size: 25px;
}


/* =========================================
   TITRE
========================================= */

.delete-title {
  margin-bottom: 12px;

  color: #00313C;

  font-size: 24px;

  font-weight: 900;

  text-align: center;
}


/* =========================================
   DESCRIPTION
========================================= */

.delete-description {
  margin-bottom: 20px;

  color: #64748B;

  font-size: 14px;

  line-height: 1.6;

  text-align: center;
}


/* =========================================
   APERCU CAMPAGNE
========================================= */

.campaign-preview {
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 16px;

  margin-bottom: 18px;

  background-color: #F8FAFC;

  border: 1px solid #E2E8F0;

  border-radius: 16px;
}

.campaign-preview-icon {
  width: 44px;
  height: 44px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  background-color: #EFF6FF;

  border-radius: 12px;

  color: #2563EB;

  font-size: 18px;
}

.campaign-preview-content {
  min-width: 0;
}

.campaign-name {
  margin-bottom: 3px;

  color: #00313C;

  font-size: 14px;

  font-weight: 800;
}

.campaign-category {
  color: #64748B;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 0.5px;

  text-transform: uppercase;
}


/* =========================================
   MESSAGE AVERTISSEMENT
========================================= */

.warning-message {
  display: flex;

  align-items: flex-start;

  gap: 10px;

  padding: 14px 16px;

  margin-bottom: 24px;

  background-color: #FFF7ED;

  border: 1px solid #FED7AA;

  border-radius: 12px;

  color: #9A3412;

  font-size: 12px;

  line-height: 1.5;
}

.warning-message i {
  flex-shrink: 0;

  margin-top: 2px;
}


/* =========================================
   BOUTONS
========================================= */

.modal-actions {
  display: flex;

  gap: 12px;
}

.btn-cancel,
.btn-delete {
  flex: 1;

  min-height: 46px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  padding: 10px 18px;

  border-radius: 12px;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;

  transition: all 0.2s ease;
}


/* =========================================
   BOUTON ANNULER
========================================= */

.btn-cancel {
  background-color: #ffffff;

  border: 1px solid #CBD5E1;

  color: #475569;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #F8FAFC;

  border-color: #94A3B8;

  color: #00313C;
}


/* =========================================
   BOUTON SUPPRIMER
========================================= */

.btn-delete {
  background-color: #D20C4F;

  border: 1px solid #D20C4F;

  color: #ffffff;
}

.btn-delete:hover:not(:disabled) {
  background-color: #B00A42;

  border-color: #B00A42;
}


/* =========================================
   BOUTONS DESACTIVES
========================================= */

.btn-cancel:disabled,
.btn-delete:disabled {
  opacity: 0.65;

  cursor: not-allowed;
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

  .delete-page {
    padding: 16px;
  }

  .modal-overlay {
    padding: 16px;
  }

  .delete-modal {
    padding: 24px;

    border-radius: 20px;
  }

  .delete-title {
    font-size: 21px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-delete {
    width: 100%;
  }

}

</style>