<!-- views/ModifierCampagne.vue -->

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { getCampagneById, updateCampagne } from '@/api/endpoints/campagnes'
import api from '@/api/axios'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const currentView = ref('campagnes')

const form = ref({
  nom: '',
  description: '',
  referentiel: 'Standard de l’entreprise',
  dateDebut: '',
  dateFin: '',
  statut: 'À VENIR'
})

const referentielId = ref(null)
const criteres = ref([])
const loading = ref(false)
const errorMessage = ref('')
const initialLoading = ref(true)

const handleViewChange = (newView) => {
  currentView.value = newView
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

const ajouterCritere = () => {
  criteres.value.push({
    id: Date.now(),
    nom: '',
    description: ''
  })
}

const supprimerCritere = (id) => {
  criteres.value = criteres.value.filter(
    (critere) => critere.id !== id
  )
}

const mapBackendStatusToFrontend = (status) => {
  const map = {
    'brouillon': 'À VENIR',
    'publiee': 'EN PROGRESSION',
    'cloturee': 'PASSÉ'
  }
  return map[status] || 'À VENIR'
}

const mapStatutToBackend = (statut) => {
  const map = {
    'À VENIR': 'brouillon',
    'EN PROGRESSION': 'publiee',
    'PASSÉ': 'cloturee'
  }
  return map[statut] || 'brouillon'
}

const loadCampagne = async () => {
  initialLoading.value = true
  errorMessage.value = ''
  try {
    const { data } = await getCampagneById(route.params.id)
    form.value = {
      nom: data.title || '',
      description: data.description || '',
      referentiel: data.referentiel?.title || 'Standard de l’entreprise',
      dateDebut: data.begin_date || '',
      dateFin: data.end_date || '',
      statut: mapBackendStatusToFrontend(data.status)
    }
    referentielId.value = data.referentiel?.id || null
    criteres.value = (data.criteres || []).map((c) => ({
      id: c.id,
      nom: c.name || '',
      description: c.description || ''
    }))
  } catch (err) {
    errorMessage.value = err.response?.data?.detail || 'Erreur lors du chargement'
  } finally {
    initialLoading.value = false
  }
}

const getOrCreateReferentiel = async (title) => {
  const { data } = await api.get('/api/referentiels/', {
    params: { title }
  })
  const items = data.results || data
  const existing = items.find(r => r.title === title)
  if (existing) return existing.id

  const { data: created } = await api.post('/api/referentiels/', {
    title,
    description: `Référentiel : ${title}`
  })
  return created.id
}

const createCriteres = async (criteresList) => {
  const ids = []
  for (const critere of criteresList) {
    if (!critere.nom) continue
    const { data } = await api.post('/api/criteres/', {
      name: critere.nom,
      description: critere.description || `Critère : ${critere.nom}`
    })
    ids.push(data.id)
  }
  return ids
}

const modifierProjet = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const referentielIdValue = referentielId.value || await getOrCreateReferentiel(form.value.referentiel)
    const criteresIds = await createCriteres(criteres.value)

    const payload = {
      title: form.value.nom,
      description: form.value.description,
      begin_date: form.value.dateDebut,
      end_date: form.value.dateFin,
      status: mapStatutToBackend(form.value.statut),
      referentiel_id: referentielIdValue,
      criteres_ids: criteresIds
    }

    console.log('Payload update campagne:', JSON.stringify(payload, null, 2))
    await updateCampagne(route.params.id, payload)
    router.push('/campagnes')
  } catch (err) {
    console.error('Erreur modification campagne:', err)
    const data = err.response?.data
    if (data) {
      const messages = Object.entries(data)
        .map(([key, value]) => {
          if (Array.isArray(value)) return `${key}: ${value.join(', ')}`
          if (value && typeof value === 'object') return `${key}: ${JSON.stringify(value)}`
          return `${key}: ${value}`
        })
        .join(' | ')
      errorMessage.value = messages || 'Erreur lors de la modification'
    } else {
      errorMessage.value = err.message || 'Erreur lors de la modification'
    }
  } finally {
    loading.value = false
  }
}

const annuler = () => {
  router.back()
}

const fermer = () => {
  router.back()
}

onMounted(() => {
  loadCampagne()
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

          <button
            type="button"
            class="btn btn-link text-secondary p-0 back-button"
            @click="annuler"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </button>

          <span class="page-label">
            Modifier
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
           FORMULAIRE
      ========================== -->
      <main class="form-page" v-if="!initialLoading">

        <div class="form-card">

          <div v-if="errorMessage" class="alert alert-danger mx-4 mt-4">
            {{ errorMessage }}
          </div>

          <!-- =========================
               INFORMATIONS GENERALES
          ========================== -->
          <section class="form-header">

            <div class="d-flex justify-content-between align-items-start">

              <h1 class="form-title">
                Modifier le projet
              </h1>

              <button
                type="button"
                class="close-button"
                @click="fermer"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>

            </div>

            <!-- Nom -->
            <div>

              <label class="custom-label">
                Nom du projet
              </label>

              <input
                v-model="form.nom"
                type="text"
                class="form-control custom-input"
              />

            </div>

            <!-- Description -->
            <div>

              <label class="custom-label">
                Description
              </label>

              <textarea
                v-model="form.description"
                class="form-control custom-textarea"
                placeholder="Ajoutez une description détaillée..."
                rows="4"
              ></textarea>

            </div>

            <!-- Référentiel -->
            <div>

              <label class="custom-label d-flex align-items-center gap-1">

                Référentiel

                <i
                  class="fa-regular fa-circle-question"
                  title="Référentiel utilisé pour le projet"
                ></i>

              </label>

              <div class="position-relative">

                <i class="fa-solid fa-book reference-icon"></i>

                <select
                  v-model="form.referentiel"
                  class="form-select custom-input reference-select"
                >

                  <option>
                    Standard de l’entreprise
                  </option>

                  <option>
                    Standard ISO
                  </option>

                  <option>
                    Standard interne
                  </option>

                </select>

              </div>

            </div>

          </section>

          <!-- =========================
               PARAMETRES
          ========================== -->
          <section class="settings-section">

            <h2 class="settings-title">
              Paramètres
            </h2>

            <!-- Dates -->
            <div class="row g-3 mb-4">

              <!-- Date début -->
              <div class="col-md-6">

                <label class="custom-label">
                  Date de début
                </label>

                <div class="position-relative">

                  <i
                    class="fa-regular fa-calendar calendar-icon"
                  ></i>

                  <input
                    v-model="form.dateDebut"
                    type="date"
                    class="form-control custom-input date-input"
                  />

                </div>

              </div>

              <!-- Date fin -->
              <div class="col-md-6">

                <label class="custom-label">
                  Date de fin
                </label>

                <div class="position-relative">

                  <i
                    class="fa-regular fa-calendar calendar-icon"
                  ></i>

                  <input
                    v-model="form.dateFin"
                    type="date"
                    class="form-control custom-input date-input"
                  />

                </div>

              </div>

            </div>

            <!-- =========================
                 STATUT
            ========================== -->
            <div class="mb-4">

              <label class="custom-label">
                Statut
              </label>

              <select
                v-model="form.statut"
                class="form-select custom-input"
              >

                <option value="À VENIR">
                  À VENIR
                </option>

                <option value="EN PROGRESSION">
                  EN PROGRESSION
                </option>

                <option value="PASSÉ">
                  PASSÉ
                </option>

              </select>

            </div>

            <!-- =========================
                 CRITERES
            ========================== -->
            <div>

              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >

                <div class="d-flex align-items-center gap-2">

                  <h3 class="criteria-title mb-0">
                    Critères d'évaluation
                  </h3>

                  <i
                    class="fa-regular fa-circle-question text-secondary"
                  ></i>

                </div>

                <button
                  type="button"
                  class="btn btn-link add-criteria-button"
                  @click="ajouterCritere"
                >
                  <i class="fa-solid fa-plus"></i>
                  Ajouter
                </button>

              </div>

              <!-- Liste des critères -->
              <div class="criteria-list">

                <div
                  v-for="critere in criteres"
                  :key="critere.id"
                  class="criterion-card"
                >

                  <div class="d-flex align-items-start gap-3">

                    <div class="flex-grow-1">

                      <input
                        v-model="critere.nom"
                        type="text"
                        class="form-control criterion-name"
                        placeholder="Nom"
                      />

                    </div>

                    <button
                      type="button"
                      class="delete-button"
                      @click="supprimerCritere(critere.id)"
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </button>

                  </div>

                  <textarea
                    v-model="critere.description"
                    class="form-control criterion-description"
                    placeholder="Description brève du critère..."
                    rows="1"
                  ></textarea>

                </div>

              </div>

            </div>

            <!-- =========================
                 BOUTONS
            ========================== -->
            <div class="form-actions">

              <button
                type="button"
                class="btn btn-create"
                @click="modifierProjet"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Modifier
              </button>

              <button
                type="button"
                class="btn btn-cancel"
                @click="annuler"
              >
                Annuler
              </button>

            </div>

          </section>

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
   FORMULAIRE
========================================= */

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


/* =========================================
   HEADER FORMULAIRE
========================================= */

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


/* =========================================
   LABELS
========================================= */

.custom-label {
  display: block;

  margin-bottom: 6px;

  color: #64748B;

  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
}


/* =========================================
   INPUTS
========================================= */

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


/* =========================================
   TEXTAREA
========================================= */

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


/* =========================================
   REFERENTIEL
========================================= */

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
}


/* =========================================
   PARAMETRES
========================================= */

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


/* =========================================
   DATES
========================================= */

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


/* =========================================
   CRITERES
========================================= */

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
  min-height: 34px;

  padding: 6px 12px;

  background-color: #F1F5F9;

  border: none;
  border-radius: 4px;

  color: #1E293B;

  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.criterion-description {
  padding: 4px;

  border: none;

  background-color: transparent;

  color: #64748B;

  font-family: 'Inter', sans-serif;
  font-size: 12px;

  resize: none;
}

.delete-button {
  padding: 8px 6px;

  border: none;
  background: transparent;

  color: #64748B;

  cursor: pointer;
}

.delete-button:hover {
  color: #DC2626;
}


/* =========================================
   BOUTONS
========================================= */

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
}

.btn-create:hover {
  background-color: #B00A42;
  color: white;
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