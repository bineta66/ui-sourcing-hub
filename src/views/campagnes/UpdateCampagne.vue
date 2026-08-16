<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import ModalCreation from '@/components/ModalCreation.vue'

import { useCampagnesStore } from '@/stores/campagnes'
import { useCriteresStore } from '@/stores/criteres'
import { useReferentielsStore } from '@/stores/referentiels'

const route = useRoute() // permet de lire l'id de la campagne dans l'URL (/campagnes/update/:id)
const campagnesStore = useCampagnesStore()
const criteresStore = useCriteresStore()
const referentielsStore = useReferentielsStore()

const currentView = ref('campagnes')

// Même structure que le formulaire de création
// -> reste vide au départ, sera rempli au montage par préremplirFormulaire()
const form = ref({
  title: '',
  description: '',
  begin_date: '',
  end_date: '',
  status: 'brouillon',
  referentiel_id: null,
  criteres_ids: []
})

const showModalCritere = ref(false)
const showModalReferentiel = ref(false)

const isSubmitting = ref(false)
const submitError = ref(null)
const isLoading = ref(true) // le temps que la campagne + listes soient chargées

// Récupère l'id une seule fois (utile pour la soumission finale)
const campagneId = route.params.id

// Transforme les données renvoyées par l'API (objets imbriqués)
// en un formulaire utilisable par les <select>/checkboxes (ids simples)
const preremplirFormulaire = (campagne) => {
  form.value.title = campagne.title
  form.value.description = campagne.description
  form.value.begin_date = campagne.begin_date
  form.value.end_date = campagne.end_date
  form.value.status = campagne.status

  // referentiel arrive comme un objet { id, title, description } en lecture -> on garde juste l'id
  form.value.referentiel_id = campagne.referentiel?.id ?? null

  // criteres arrive comme un tableau d'objets [{ id, name, ... }] -> on garde juste les ids
  form.value.criteres_ids = (campagne.criteres || []).map((c) => c.id)
}

onMounted(async () => {
  // On charge en parallèle : la campagne à modifier + les listes de critères/référentiels
  await Promise.all([
    campagnesStore.fetchCampagneById(campagneId),
    criteresStore.fetchCriteres(),
    referentielsStore.fetchReferentiels()
  ])

  if (campagnesStore.campagneActive) {
    preremplirFormulaire(campagnesStore.campagneActive)
  }

  isLoading.value = false
})

// Coche/décoche un critère (identique à la création)
const toggleCritere = (id) => {
  const index = form.value.criteres_ids.indexOf(id)
  if (index === -1) {
    form.value.criteres_ids.push(id)
  } else {
    form.value.criteres_ids.splice(index, 1)
  }
}

const handleCreateCritere = async (nouveauCritere) => {
  try {
    const critere = await criteresStore.ajouterCritere(nouveauCritere)
    showModalCritere.value = false
    form.value.criteres_ids.push(critere.id)
  } catch (err) {
    console.error('Erreur lors de la création du critère :', err)
  }
}

const handleCreateReferentiel = async (nouveauReferentiel) => {
  try {
    const referentiel = await referentielsStore.ajouterReferentiel(nouveauReferentiel)
    showModalReferentiel.value = false
    form.value.referentiel_id = referentiel.id
  } catch (err) {
    console.error('Erreur lors de la création du référentiel :', err)
  }
}

// Soumission finale -> update au lieu de create
const modifierProjet = async () => {
  if (!form.value.title.trim()) {
    submitError.value = 'Le titre est obligatoire.'
    return
  }
  if (!form.value.referentiel_id) {
    submitError.value = 'Veuillez sélectionner un référentiel.'
    return
  }

  isSubmitting.value = true
  submitError.value = null

  try {
    await campagnesStore.modifierCampagne(campagneId, form.value)
    window.history.back()
  } catch (err) {
    console.error('Erreur lors de la modification de la campagne :', err.response?.data)
    submitError.value = 'Une erreur est survenue lors de la modification.'
  } finally {
    isSubmitting.value = false
  }
}

const handleViewChange = (newView) => {
  currentView.value = newView
}

const annuler = () => window.history.back()
const fermer = () => window.history.back()
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.0/css/all.min.css"
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />

  <div class="app-layout">

    <Sidebar
      :active-view="currentView"
      @change-view="handleViewChange"
      @logout="handleLogout"
    />

    <div class="main-content">

      <header class="topbar">
        <div class="d-flex align-items-center gap-3">
          <button type="button" class="btn btn-link text-secondary p-0 back-button" @click="annuler">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <span class="page-label">Formulaire</span>
        </div>

        <div class="d-flex align-items-center gap-3">
          <button type="button" class="notification-button">
            <i class="fa-regular fa-bell"></i>
            <span class="notification-dot"></span>
          </button>

          <div class="separator"></div>

          <div class="d-flex align-items-center gap-3">
            <div class="user-information">
              <div class="user-name">Ndeye</div>
              <div class="user-role">HR SUPERVISOR</div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
              alt="Avatar de Ndeye"
              class="user-avatar"
            />
          </div>
        </div>
      </header>

      <!-- Pendant le chargement de la campagne, on affiche un message simple -->
      <main v-if="isLoading" class="form-page">
        <p class="text-muted">Chargement de la campagne...</p>
      </main>

      <main v-else class="form-page">
        <div class="form-card">

          <section class="form-header">
            <div class="d-flex justify-content-between align-items-start">
              <h1 class="form-title">Modifier la campagne</h1>
              <button type="button" class="close-button" @click="fermer">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div>
              <input
                v-model="form.title"
                type="text"
                class="form-control custom-input"
                placeholder="Titre de la campagne"
              />
            </div>

            <div>
              <label class="custom-label">Description</label>
              <textarea
                v-model="form.description"
                class="form-control custom-textarea"
                placeholder="Ajoutez une description détaillée..."
                rows="4"
              ></textarea>
            </div>

            <div>
              <label class="custom-label">Statut</label>
              <select v-model="form.status" class="form-select custom-input">
                <option value="brouillon">Brouillon</option>
                <option value="publiee">Publiée</option>
                <option value="cloturee">Clôturée</option>
              </select>
            </div>

            <hr class="form-divider" />

            <div>
              <label class="custom-label d-flex align-items-center gap-1">
                Référentiel
                <i class="fa-regular fa-circle-question" title="Référentiel utilisé pour le projet"></i>
              </label>

              <div class="d-flex gap-2">
                <div class="position-relative flex-grow-1">
                  <i class="fa-solid fa-book reference-icon"></i>

                  <select v-model="form.referentiel_id" class="form-select custom-input reference-select">
                    <option :value="null" disabled>Sélectionner un référentiel</option>
                    <option
                      v-for="ref in referentielsStore.items"
                      :key="ref.id"
                      :value="ref.id"
                    >
                      {{ ref.title }}
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  class="btn btn-link add-criteria-button"
                  @click="showModalReferentiel = true"
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

          </section>

          <section class="settings-section">
            <h2 class="settings-title">Paramètres</h2>

            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="custom-label">Date de début</label>
                <div class="position-relative">
                  <i class="fa-regular fa-calendar calendar-icon"></i>
                  <input v-model="form.begin_date" type="date" class="form-control custom-input date-input" />
                </div>
              </div>

              <div class="col-md-6">
                <label class="custom-label">Date de fin</label>
                <div class="position-relative">
                  <i class="fa-regular fa-calendar calendar-icon"></i>
                  <input v-model="form.end_date" type="date" class="form-control custom-input date-input" />
                </div>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center gap-2">
                  <h3 class="criteria-title mb-0">Critères d'évaluation</h3>
                  <i class="fa-regular fa-circle-question text-secondary" title="Critères utilisés pour évaluer la campagne"></i>
                </div>

                <button type="button" class="btn btn-link add-criteria-button" @click="showModalCritere = true">
                  <i class="fa-solid fa-plus"></i>
                  Ajouter
                </button>
              </div>

              <div class="criteria-list">
                <label
                  v-for="critere in criteresStore.items"
                  :key="critere.id"
                  class="criterion-card d-flex align-items-start gap-3"
                  style="cursor: pointer;"
                >
                  <input
                    type="checkbox"
                    :checked="form.criteres_ids.includes(critere.id)"
                    @change="toggleCritere(critere.id)"
                  />

                  <div class="flex-grow-1">
                    <div class="criterion-name">{{ critere.name }}</div>
                    <div class="criterion-description">{{ critere.description }}</div>
                  </div>
                </label>
              </div>
            </div>

            <div v-if="submitError" class="text-danger mt-3" style="font-size: 13px;">
              {{ submitError }}
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn btn-create"
                :disabled="isSubmitting"
                @click="modifierProjet"
              >
                {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
              </button>

              <button type="button" class="btn btn-cancel" @click="annuler">
                Annuler
              </button>
            </div>

          </section>

        </div>
      </main>

    </div>

    <ModalCreation
      v-if="showModalCritere"
      titre="Ajouter un critère"
      champ-key="name"
      champ-label="Nom"
      @create="handleCreateCritere"
      @close="showModalCritere = false"
    />

    <ModalCreation
      v-if="showModalReferentiel"
      titre="Ajouter un référentiel"
      champ-key="title"
      champ-label="Titre"
      @create="handleCreateReferentiel"
      @close="showModalReferentiel = false"
    />

  </div>
</template>

<style scoped>
/* === identique au style de CreateCampagne.vue, inchangé === */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap');

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

.form-page {
  min-height: calc(100vh - 72px);
  padding: 55px 24px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.form-card {
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.form-header {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid #E2E8F0;
}

.form-title {
  margin: 0;
  color: #1E293B;
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.close-button {
  border: none;
  background: transparent;
  color: #64748B;
  font-size: 18px;
  cursor: pointer;
}

.close-button:hover {
  color: #D20C4F;
}

.custom-label {
  display: block;
  margin-bottom: 6px;
  color: #64748B;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.custom-input {
  min-height: 40px;
  padding: 8px 16px;
  background-color: #F1F5F9;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #1E293B;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.custom-input:focus {
  background-color: #F1F5F9;
  border-color: #D20C4F;
  box-shadow: 0 0 0 0.2rem rgba(210, 12, 79, 0.08);
}

.custom-input::placeholder {
  color: #9CA3AF;
}

.custom-textarea {
  min-height: 94px;
  padding: 10px 16px;
  background-color: #F1F5F9;
  border: 1px solid transparent;
  border-radius: 8px;
  resize: vertical;
  color: #1E293B;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.custom-textarea:focus {
  background-color: #F1F5F9;
  border-color: #D20C4F;
  box-shadow: 0 0 0 0.2rem rgba(210, 12, 79, 0.08);
}

.form-divider {
  margin: 8px 0 6px;
  border: 0;
  border-top: 1px solid #E2E8F0;
  opacity: 1;
}

.reference-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748B;
  z-index: 2;
}

.reference-select {
  padding-left: 40px;
  cursor: pointer;
}

.settings-section {
  padding: 24px;
  background-color: #FAFAFA;
}

.settings-title {
  margin: 0 0 24px;
  color: #1E293B;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
}

.calendar-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748B;
  z-index: 2;
}

.date-input {
  padding-left: 36px;
}

.criteria-title {
  color: #1E293B;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.add-criteria-button {
  padding: 0;
  color: #0F766E;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
}

.add-criteria-button:hover {
  color: #0A5C57;
}

.criteria-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.criterion-card {
  padding: 12px;
  background-color: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.criterion-name {
  padding: 6px 0;
  color: #1E293B;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.criterion-description {
  padding: 0 0 4px;
  color: #64748B;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}

.form-actions {
  padding-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-create {
  padding: 8px 20px;
  background-color: #D20C4F;
  border: none;
  border-radius: 6px;
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-create:hover {
  background-color: #B00A42;
  color: white;
}

.btn-create:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 8px 16px;
  background-color: transparent;
  border: none;
  border-radius: 6px;
  color: #1E293B;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.btn-cancel:hover {
  background-color: #E2E8F0;
}

@media (max-width: 768px) {
  .topbar {
    padding: 0 16px;
  }
  .user-information {
    display: none;
  }
  .form-page {
    padding: 24px 12px;
  }
  .form-header,
  .settings-section {
    padding: 20px;
  }
  .form-title {
    font-size: 18px;
  }
}
</style>