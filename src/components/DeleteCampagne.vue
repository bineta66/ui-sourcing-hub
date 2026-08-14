<!-- components/DeleteCampagne.vue -->

<script setup>

defineProps({
  campagne: {
    type: Object,
    required: true
  },

  suppressionEnCours: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'cancel',
  'confirm'
])

</script>


<template>

  <!-- Overlay -->

  <div
    class="modal-overlay"
    @click.self="emit('cancel')"
  >

    <!-- Modal -->

    <div class="delete-modal">


      <!-- Icône -->

      <div class="delete-icon">

        <i class="fa-regular fa-trash-can"></i>

      </div>


      <!-- Titre -->

      <h2 class="delete-title">
        Supprimer cette campagne ?
      </h2>


      <!-- Description -->

      <p class="delete-description">

        Vous êtes sur le point de supprimer définitivement
        cette campagne.

      </p>


      <!-- Campagne -->

      <div class="campaign-preview">

        <div class="campaign-preview-icon">

          <i class="fa-solid fa-cloud"></i>

        </div>


        <div class="campaign-preview-content">

          <div class="campaign-name">
            {{ campagne.title }}
          </div>

          <div class="campaign-category">
            {{ campagne.category }}
          </div>

        </div>

      </div>


      <!-- Avertissement -->

      <div class="warning-message">

        <i class="fa-solid fa-circle-exclamation"></i>

        <span>
          Cette action est définitive. Les informations
          associées à cette campagne seront supprimées.
        </span>

      </div>


      <!-- Boutons -->

      <div class="modal-actions">


        <!-- Annuler -->

        <button
          type="button"
          class="btn-cancel"
          :disabled="suppressionEnCours"
          @click="emit('cancel')"
        >

          Annuler

        </button>


        <!-- Supprimer -->

        <button
          type="button"
          class="btn-delete"
          :disabled="suppressionEnCours"
          @click="emit('confirm')"
        >

          <span
            v-if="suppressionEnCours"
            class="spinner-border spinner-border-sm"
          ></span>

          <i
            v-else
            class="fa-regular fa-trash-can"
          ></i>

          <span>

            {{
              suppressionEnCours
                ? 'Suppression...'
                : 'Supprimer'
            }}

          </span>

        </button>

      </div>

    </div>

  </div>

</template>


<style scoped>

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.0/css/all.min.css');


/* =========================================
   OVERLAY
========================================= */

.modal-overlay {

  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 24px;

  /*
   * Arrière-plan sombre + flou
   */

  background-color: rgba(15, 23, 42, 0.45);

  backdrop-filter: blur(6px);

  -webkit-backdrop-filter: blur(6px);

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
    0 25px 60px rgba(15, 23, 42, 0.25);

  animation: modalAppear 0.2s ease-out;

}


/* =========================================
   ANIMATION
========================================= */

@keyframes modalAppear {

  from {

    opacity: 0;

    transform: scale(0.95);

  }

  to {

    opacity: 1;

    transform: scale(1);

  }

}


/* =========================================
   ICON
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
   CAMPAGNE
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
   AVERTISSEMENT
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
   ACTIONS
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
   ANNULER
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
   SUPPRIMER
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
   DISABLED
========================================= */

.btn-cancel:disabled,
.btn-delete:disabled {

  opacity: 0.65;

  cursor: not-allowed;

}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 576px) {

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

}

</style>