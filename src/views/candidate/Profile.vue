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
        <div class="main-column">
          <div class="profile-header-card">
            <div class="profile-header-left">
              <div class="profile-avatar">
                <img
                  :src="profile.avatarUrl"
                  alt="Bineta Badiane"
                  class="avatar-img"
                />
              </div>
              <div class="profile-identity">
                <h2 class="profile-name">{{ profile.firstName }} {{ profile.lastName }}</h2>
                <p class="profile-role">Candidate</p>
                <span class="profile-campaign">Candidat(e) — DWWM 2026</span>
              </div>
            </div>
            <button class="btn btn-submit btn-sm" @click="openEditModal">
              <i class="fa-regular fa-pen-to-square me-1"></i>
              Modifier mon profil
            </button>
          </div>

          <div class="profile-grid">
            <div class="profile-card">
              <h3 class="profile-card-title">Informations personnelles</h3>
              <div class="profile-card-body">
                <div class="profile-row">
                  <div class="profile-field">
                    <span class="profile-label">
                      <i class="fa-regular fa-user me-1"></i>
                      Nom complet
                    </span>
                    <span class="profile-value">{{ profile.firstName }} {{ profile.lastName }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">
                      <i class="fa-regular fa-envelope me-1"></i>
                      Email
                    </span>
                    <span class="profile-value">{{ profile.email }}</span>
                  </div>
                </div>
                <div class="profile-row">
                  <div class="profile-field">
                    <span class="profile-label">
                      <i class="fa-solid fa-phone me-1"></i>
                      Téléphone
                    </span>
                    <span class="profile-value">{{ profile.phone }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">
                      <i class="fa-regular fa-calendar me-1"></i>
                      Date de naissance
                    </span>
                    <span class="profile-value">{{ profile.birthDate }}</span>
                  </div>
                </div>
                <div class="profile-field">
                  <span class="profile-label">
                    <i class="fa-solid fa-location-dot me-1"></i>
                    Adresse
                  </span>
                  <span class="profile-value">{{ profile.address }}</span>
                </div>
              </div>
            </div>

            <div class="profile-card">
              <h3 class="profile-card-title">Parcours académique</h3>
              <div class="profile-card-body">
                <div class="profile-row">
                  <div class="profile-field">
                    <span class="profile-label">Niveau d'études</span>
                    <span class="profile-value">{{ profile.academic.educationLevel }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">Domaine d'études</span>
                    <span class="profile-value">{{ profile.academic.field }}</span>
                  </div>
                </div>
                <div class="profile-row">
                  <div class="profile-field">
                    <span class="profile-label">Spécialité</span>
                    <span class="profile-value">{{ profile.academic.speciality }}</span>
                  </div>
                  <div class="profile-field">
                    <span class="profile-label">Établissement</span>
                    <span class="profile-value">{{ profile.academic.institution }}</span>
                  </div>
                </div>
                <div class="profile-field">
                  <span class="profile-label">Année d'obtention</span>
                  <span class="profile-value">{{ profile.academic.graduationYear }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Modifier mon profil</h3>
          <button class="modal-close" @click="closeEditModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-3 text-center">
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Aperçu avatar"
              class="avatar-preview-img"
            />
            <label class="form-label mt-2">Photo de profil</label>
            <input class="form-control" type="file" accept="image/*" @change="onAvatarChange" />
          </div>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Prénom</label>
              <input v-model="form.firstName" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Nom</label>
              <input v-model="form.lastName" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Téléphone</label>
              <input v-model="form.phone" type="tel" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Date de naissance</label>
              <input v-model="form.birthDate" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Adresse</label>
              <input v-model="form.address" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Niveau d'études</label>
              <input v-model="form.academic.educationLevel" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Domaine d'études</label>
              <input v-model="form.academic.field" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Spécialité</label>
              <input v-model="form.academic.speciality" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Établissement</label>
              <input v-model="form.academic.institution" type="text" class="form-control" />
            </div>
            <div class="col-md-12">
              <label class="form-label">Année d'obtention</label>
              <input v-model="form.academic.graduationYear" type="text" class="form-control" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" @click="closeEditModal">Annuler</button>
          <button class="btn btn-submit" @click="saveProfile">
            <i class="fa-solid fa-check me-1"></i>
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CandidateSidebar from '@/components/CandidateSidebar.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const profile = reactive({
  firstName: authStore.user?.first_name || 'Bineta',
  lastName: authStore.user?.last_name || 'Badiane',
  email: authStore.user?.email || 'bineta.badiane@email.com',
  phone: authStore.user?.phone_number || '+221 77 123 45 67',
  birthDate: '12/05/2001',
  address: 'Dakar, Sénégal',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  academic: {
    educationLevel: 'Licence',
    field: 'Informatique',
    speciality: 'Développement Web',
    institution: 'Université / École',
    graduationYear: '2025'
  }
})

const showEditModal = ref(false)
const avatarPreview = ref('')
const avatarFile = ref(null)
const isSaving = ref(false)

const form = reactive({
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email,
  phone: profile.phone,
  birthDate: profile.birthDate,
  address: profile.address,
  avatarUrl: profile.avatarUrl,
  academic: {
    educationLevel: profile.academic.educationLevel,
    field: profile.academic.field,
    speciality: profile.academic.speciality,
    institution: profile.academic.institution,
    graduationYear: profile.academic.graduationYear
  }
})

onMounted(() => {
  if (authStore.user) {
    if (authStore.user.first_name) profile.firstName = authStore.user.first_name
    if (authStore.user.last_name) profile.lastName = authStore.user.last_name
    if (authStore.user.email) profile.email = authStore.user.email
    if (authStore.user.phone_number) profile.phone = authStore.user.phone_number
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const openEditModal = () => {
  form.firstName = profile.firstName
  form.lastName = profile.lastName
  form.email = profile.email
  form.phone = profile.phone
  form.birthDate = profile.birthDate
  form.address = profile.address
  form.avatarUrl = profile.avatarUrl
  form.academic.educationLevel = profile.academic.educationLevel
  form.academic.field = profile.academic.field
  form.academic.speciality = profile.academic.speciality
  form.academic.institution = profile.academic.institution
  form.academic.graduationYear = profile.academic.graduationYear
  avatarPreview.value = profile.avatarUrl
  avatarFile.value = null
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  avatarPreview.value = ''
  avatarFile.value = null
}

const onAvatarChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    if (authStore.isAuthenticated) {
      await authStore.completeProfile({
        first_name: form.firstName,
        last_name: form.lastName,
        phone_number: form.phone,
      })
    }
    profile.firstName = form.firstName
    profile.lastName = form.lastName
    profile.email = form.email
    profile.phone = form.phone
    profile.birthDate = form.birthDate
    profile.address = form.address
    profile.academic.educationLevel = form.academic.educationLevel
    profile.academic.field = form.academic.field
    profile.academic.speciality = form.academic.speciality
    profile.academic.institution = form.academic.institution
    profile.academic.graduationYear = form.academic.graduationYear
    if (avatarFile.value) {
      profile.avatarUrl = avatarPreview.value
    }
    alert('Profil mis à jour avec succès.')
    closeEditModal()
  } catch (err) {
    alert(authStore.error || 'Erreur lors de la mise à jour du profil.')
  } finally {
    isSaving.value = false
  }
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

.main-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-header-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.profile-header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-preview-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #E5E7EB;
  margin: 0 auto;
  display: block;
}

.profile-identity {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.profile-role {
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  margin: 0;
}

.profile-campaign {
  font-size: 12px;
  font-weight: 600;
  color: #D20C4F;
  margin-top: 4px;
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

.profile-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #F3F4F6;
}

.profile-card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  display: flex;
  align-items: center;
}

.profile-value {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
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
  max-width: 720px;
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
  max-height: 70vh;
  overflow-y: auto;
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

  .profile-header-card {
    flex-direction: column;
    text-align: center;
  }

  .profile-header-left {
    flex-direction: column;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-row {
    grid-template-columns: 1fr;
  }
}
</style>
