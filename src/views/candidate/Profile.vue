<template>
  <div class="app-layout">
    <CandidateSidebar :active-view="'profil'" @logout="handleLogout" />

    <div class="main-content">
      <header class="topbar">
        <div class="d-flex align-items-center gap-3">
          <i class="fa-regular fa-user text-danger fs-4"></i>
          <h1 class="page-title mb-0">Mon profil</h1>
        </div>

        <div class="d-flex align-items-center gap-3">
          <button type="button" class="notification-button position-relative">
            <i class="fa-regular fa-bell fs-5"></i>
            <span class="notification-badge">3</span>
          </button>

          <div class="campaign-selector">
            <span class="campaign-label">Campagne</span>
            <div class="campaign-name">
              DWWM 2026
              <i class="fa-solid fa-chevron-down ms-1"></i>
            </div>
          </div>
        </div>
      </header>

      <div class="content-area">
        <div class="content-grid">
          <div class="main-column">
            <p class="page-description">
              Consultez et gérez vos informations personnelles et votre parcours académique.
            </p>

            <div class="profile-grid">
              <div class="profile-card">
                <div class="profile-card-header">
                  <div class="profile-icon-circle" style="background: #FDF2F8; color: #D20C4F;">
                    <i class="fa-regular fa-user fs-4"></i>
                  </div>
                  <h2 class="profile-card-title">Informations personnelles</h2>
                </div>

                <div class="profile-card-body">
                  <div class="profile-field">
                    <span class="profile-label">Prénom</span>
                    <span class="profile-value">{{ profile.personal.firstName }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">Nom</span>
                    <span class="profile-value">{{ profile.personal.lastName }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">Email</span>
                    <span class="profile-value">{{ profile.personal.email }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">Téléphone</span>
                    <span class="profile-value">{{ profile.personal.phone }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">Ville</span>
                    <span class="profile-value">{{ profile.personal.city }}</span>
                  </div>
                </div>

                <div class="profile-card-footer">
                  <button class="btn btn-submit btn-sm" @click="openPersonalModal">
                    <i class="fa-regular fa-pen-to-square me-1"></i>
                    Modifier
                  </button>
                </div>
              </div>

              <div class="profile-card">
                <div class="profile-card-header">
                  <div class="profile-icon-circle" style="background: #EFF6FF; color: #2563EB;">
                    <i class="fa-solid fa-graduation-cap fs-4"></i>
                  </div>
                  <h2 class="profile-card-title">Parcours académique</h2>
                </div>

                <div class="profile-card-body">
                  <div class="profile-field">
                    <span class="profile-label">Niveau d'études</span>
                    <span class="profile-value">{{ profile.academic.educationLevel }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">Domaine d'études</span>
                    <span class="profile-value">{{ profile.academic.field }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">Établissement</span>
                    <span class="profile-value">{{ profile.academic.institution }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">Année d'obtention</span>
                    <span class="profile-value">{{ profile.academic.graduationYear }}</span>
                  </div>
                </div>

                <div class="profile-card-footer">
                  <button class="btn btn-submit btn-sm" @click="openAcademicModal">
                    <i class="fa-regular fa-pen-to-square me-1"></i>
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="side-column">
            <div class="info-card">
              <div class="info-card-header">
                <div class="info-icon-circle">
                  <i class="fa-regular fa-circle-info text-primary"></i>
                </div>
                <h4 class="info-card-title mb-0">Informations utiles</h4>
              </div>
              <ul class="info-list">
                <li>Assurez-vous que vos coordonnées sont à jour.</li>
                <li>Ces informations sont utilisées pour vos candidatures.</li>
                <li>Contactez le support si une information est erronée.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPersonalModal" class="modal-overlay" @click.self="closePersonalModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Modifier mes informations personnelles</h3>
          <button class="modal-close" @click="closePersonalModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Prénom</label>
              <input v-model="personalForm.firstName" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Nom</label>
              <input v-model="personalForm.lastName" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input v-model="personalForm.email" type="email" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Téléphone</label>
              <input v-model="personalForm.phone" type="tel" class="form-control" />
            </div>
            <div class="col-md-12">
              <label class="form-label">Ville</label>
              <input v-model="personalForm.city" type="text" class="form-control" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" @click="closePersonalModal">Annuler</button>
          <button class="btn btn-submit" @click="savePersonal">
            <i class="fa-solid fa-check me-1"></i>
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAcademicModal" class="modal-overlay" @click.self="closeAcademicModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Modifier mon parcours académique</h3>
          <button class="modal-close" @click="closeAcademicModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Niveau d'études</label>
              <input v-model="academicForm.educationLevel" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Domaine d'études</label>
              <input v-model="academicForm.field" type="text" class="form-control" />
            </div>
            <div class="col-md-12">
              <label class="form-label">Établissement</label>
              <input v-model="academicForm.institution" type="text" class="form-control" />
            </div>
            <div class="col-md-12">
              <label class="form-label">Année d'obtention</label>
              <input v-model="academicForm.graduationYear" type="text" class="form-control" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" @click="closeAcademicModal">Annuler</button>
          <button class="btn btn-submit" @click="saveAcademic">
            <i class="fa-solid fa-check me-1"></i>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import CandidateSidebar from '@/components/CandidateSidebar.vue'

const profile = reactive({
  personal: {
    firstName: 'Bineta',
    lastName: 'Badiane',
    email: 'bineta@example.com',
    phone: '+221 77 000 00 00',
    city: 'Dakar'
  },
  academic: {
    educationLevel: 'Licence',
    field: 'Développement Web',
    institution: 'Université / École',
    graduationYear: '2025'
  }
})

const showPersonalModal = ref(false)
const showAcademicModal = ref(false)

const personalForm = reactive({
  firstName: profile.personal.firstName,
  lastName: profile.personal.lastName,
  email: profile.personal.email,
  phone: profile.personal.phone,
  city: profile.personal.city
})

const academicForm = reactive({
  educationLevel: profile.academic.educationLevel,
  field: profile.academic.field,
  institution: profile.academic.institution,
  graduationYear: profile.academic.graduationYear
})

const handleLogout = () => {
  console.log("Déconnexion de l'utilisateur")
}

const openPersonalModal = () => {
  personalForm.firstName = profile.personal.firstName
  personalForm.lastName = profile.personal.lastName
  personalForm.email = profile.personal.email
  personalForm.phone = profile.personal.phone
  personalForm.city = profile.personal.city
  showPersonalModal.value = true
}

const closePersonalModal = () => {
  showPersonalModal.value = false
}

const savePersonal = () => {
  profile.personal.firstName = personalForm.firstName
  profile.personal.lastName = personalForm.lastName
  profile.personal.email = personalForm.email
  profile.personal.phone = personalForm.phone
  profile.personal.city = personalForm.city
  alert('Informations personnelles enregistrées.')
  closePersonalModal()
}

const openAcademicModal = () => {
  academicForm.educationLevel = profile.academic.educationLevel
  academicForm.field = profile.academic.field
  academicForm.institution = profile.academic.institution
  academicForm.graduationYear = profile.academic.graduationYear
  showAcademicModal.value = true
}

const closeAcademicModal = () => {
  showAcademicModal.value = false
}

const saveAcademic = () => {
  profile.academic.educationLevel = academicForm.educationLevel
  profile.academic.field = academicForm.field
  profile.academic.institution = academicForm.institution
  profile.academic.graduationYear = academicForm.graduationYear
  alert('Parcours académique enregistré.')
  closeAcademicModal()
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #FFFFFF;
  font-family: 'Inter', 'Nunito Sans', sans-serif;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  z-index: 20;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.page-description {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 20px;
}

.notification-button {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  background: #FFFFFF;
  color: #4B5563;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.notification-button:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #EF4444;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFFFFF;
}

.campaign-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.15s;
}

.campaign-selector:hover {
  background: #F9FAFB;
}

.campaign-label {
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.campaign-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
}

.content-area {
  flex: 1;
  padding: 24px 32px 32px;
  overflow-y: auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.main-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.profile-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F3F4F6;
}

.profile-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.profile-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-label {
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.profile-value {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.profile-card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.info-icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #EFF6FF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-list li {
  font-size: 13px;
  color: #4B5563;
  line-height: 1.5;
  padding-left: 16px;
  position: relative;
}

.info-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3B82F6;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1060;
}

.modal-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 560px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #F3F4F6;
  color: #4B5563;
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.modal-close:hover {
  background: #E5E7EB;
  color: #111827;
}

.modal-body {
  padding: 20px 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 24px 20px;
}

.btn-submit {
  background: #D20C4F;
  border-color: #D20C4F;
  color: #FFFFFF;
  font-weight: 600;
}

.btn-submit:hover {
  background: #b9103f;
  border-color: #b9103f;
  color: #FFFFFF;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    position: static;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 16px;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
