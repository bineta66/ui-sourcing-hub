<script setup>
import { ref } from 'vue'

const props = defineProps({
  titre: { type: String, required: true },
  // Nom de la clé à utiliser dans l'objet émis :
  // 'name' pour Critère, 'title' pour Référentiel
  champKey: { type: String, required: true },
  // Libellé affiché au-dessus du champ (ex: "Nom" ou "Titre")
  champLabel: { type: String, default: 'Nom' }
})

const emit = defineEmits(['create', 'close'])

// Variable interne neutre : on ne connaît pas encore le nom final de la clé
// -> le mapping vers 'name' ou 'title' se fait seulement au moment d'émettre
const valeurChamp = ref('')
const description = ref('')

const valider = () => {
  if (!valeurChamp.value.trim()) return // garde-fou : pas de création vide

  // Construction dynamique de l'objet :
  // -> { name: '...', description: '...' } pour un Critère
  // -> { title: '...', description: '...' } pour un Référentiel
  emit('create', {
    [props.champKey]: valeurChamp.value,
    description: description.value
  })

  // Reset des champs pour la prochaine ouverture du modal
  valeurChamp.value = ''
  description.value = ''
}

const fermer = () => emit('close')
</script>

<template>
  <!-- Clic sur le fond sombre = fermeture du modal -->
  <div class="modal-overlay" @click.self="fermer">
    <div class="modal-box">

      <div class="d-flex justify-content-between align-items-start mb-3">
        <h2 class="form-title" style="font-size:16px;">{{ titre }}</h2>
        <button type="button" class="close-button" @click="fermer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="mb-3">
        <label class="custom-label">{{ champLabel }}</label>
        <input
          v-model="valeurChamp"
          type="text"
          class="form-control custom-input"
          :placeholder="champLabel"
        />
      </div>

      <div class="mb-3">
        <label class="custom-label">Description</label>
        <textarea
          v-model="description"
          class="form-control custom-textarea"
          placeholder="Description"
          rows="3"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-create" @click="valider">Créer</button>
        <button type="button" class="btn btn-cancel" @click="fermer">Annuler</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
</style>