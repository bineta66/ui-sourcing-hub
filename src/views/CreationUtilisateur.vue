<template>
  <div class="dashboard-page">
    <Sidebar active-view="utilisateurs" />

    <main class="main-content">
      <header class="topbar">
        <div class="breadcrumb">
          <router-link to="/gestion-utilisateurs" class="back-link">
            <i class="bi bi-arrow-left"></i>
          </router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-parent">Admin</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ isEditMode ? 'Modifier un utilisateur' : 'Création d\'un nouvel utilisateur' }}</span>
        </div>
        <button class="btn btn-dark btn-create-account" :disabled="loading" @click="handleSubmit">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
          {{ isEditMode ? 'Mettre à jour' : 'Inviter l\'utilisateur' }}
        </button>
      </header>

      <div class="content-body">
        <!-- Alertes Feedback -->
        <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center py-2 px-3 mb-3" style="font-size: 13px; border-radius: 8px;">
          <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{{ errorMessage }}</div>
        </div>

        <div v-if="successMessage" class="alert alert-success d-flex align-items-center py-2 px-3 mb-3" style="font-size: 13px; border-radius: 8px;">
          <i class="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{{ successMessage }}</div>
        </div>

        <div class="two-col-layout">

          <div class="col-main">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Information utilisateur</h3>
                <p class="card-subtitle">Configurez l'identité principale et les coordonnées</p>
              </div>

              <div class="card-body">
                <div class="profile-upload">
                  <div class="upload-placeholder">
                    <i class="bi bi-camera"></i>
                  </div>
                  <div class="upload-info">
                    <p class="upload-title">Photo profil</p>
                    <p class="upload-desc">Téléchargez un portrait en haute résolution (JPG, PNG, jusqu'à 5 Mo).</p>
                    <p class="upload-hint">Taille recommandée : 400 × 400 px.</p>
                  </div>
                  <button class="btn btn-upload">Ajouter une photo</button>
                </div>

                <hr class="divider">

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Nom complet</label>
                    <input type="text" class="form-control" v-model="form.firstname" placeholder="ex. Jonathan Doe">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Adresse email</label>
                    <input type="email" class="form-control" v-model="form.email" placeholder="jonathan@company.com">
                  </div>
                </div>

                <div class="row g-3 mt-2">
                  <div class="col-md-6">
                    <label class="form-label">Numéro</label>
                    <input type="tel" class="form-control" v-model="form.phone" placeholder="+1 (555) 000-0000">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Référentiel</label>
                    <input type="text" class="form-control" v-model="form.referentiel" placeholder="Talent Acquisition">
                  </div>
                </div>

                <div class="row g-3 mt-2">
                  <div class="col-md-6">
                    <label class="form-label">Rôle</label>
                    <select class="form-control" v-model="form.role">
                      <option>admin</option>
                      <option>jury</option>
                      <option>candidate</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Statut compte</label>
                    <div class="radio-group">
                      <label class="radio-item" :class="{ active: form.status === 'active' }">
                        <input type="radio" name="status" value="active" v-model="form.status">
                        <span class="radio-dot"></span>
                        <span class="radio-label">Active</span>
                      </label>
                      <label class="radio-item" :class="{ active: form.status === 'inactive' }">
                        <input type="radio" name="status" value="inactive" v-model="form.status">
                        <span class="radio-dot"></span>
                        <span class="radio-label">Désactiver</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sidebar">
            <div class="card mb-3">
              <div class="card-header">
                <h3 class="card-title">Permissions et accès</h3>
                <p class="card-subtitle">Définissez les accès que cet utilisateur peut effectuer</p>
              </div>
              <div class="card-body">
                <div class="permission-list">
                  <div class="permission-item">
                    <div class="permission-info">
                      <span class="permission-title">Gérer les candidats</span>
                      <span class="permission-desc">Accès complet au pipeline des candidats</span>
                    </div>
                    <label class="toggle active">
                      <input type="checkbox" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="permission-item">
                    <div class="permission-info">
                      <span class="permission-title">Gérer les entretiens</span>
                      <span class="permission-desc">Accès aux entretiens</span>
                    </div>
                    <label class="toggle active">
                      <input type="checkbox" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="permission-item">
                    <div class="permission-info">
                      <span class="permission-title">Gérer les formations</span>
                      <span class="permission-desc">Autoriser le suivi des modules d'apprentissage</span>
                    </div>
                    <label class="toggle">
                      <input type="checkbox">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="permission-item">
                    <div class="permission-info">
                      <span class="permission-title">Accéder aux analyses</span>
                      <span class="permission-desc">Consulter les tableaux de bord et rapports</span>
                    </div>
                    <label class="toggle active">
                      <input type="checkbox" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="permission-item">
                    <div class="permission-info">
                      <span class="permission-title">Exporter les rapports</span>
                      <span class="permission-desc">Générer des rapports PDF/CSV</span>
                    </div>
                    <label class="toggle">
                      <input type="checkbox">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="permission-item">
                    <div class="permission-info">
                      <span class="permission-title">Gérer les utilisateurs</span>
                      <span class="permission-desc">Créer et modifier les comptes système</span>
                    </div>
                    <label class="toggle active">
                      <input type="checkbox" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <footer class="action-bar">
          <p class="action-info">Les champs marqués sont obligatoires pour l'activation du compte.</p>
          <div class="action-buttons">
            <router-link to="/gestion-utilisateurs" class="btn btn-cancel">Annuler et fermer</router-link>
            <button class="btn btn-primary-action" :disabled="loading" @click="handleSubmit">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
              {{ isEditMode ? 'Enregistrer les modifications' : 'Inviter l\'utilisateur' }}
            </button>
          </div>
        </footer>

      </div>

    </main>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const defaultUser = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  referentiel: 'Talent Acquisition',
  role: 'admin',
  status: 'active',
}

const isEditMode = ref(false)
const form = reactive({ ...defaultUser })
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Mapping role frontend -> role backend
const mapRoleToBackend = (role) => {
  const normalized = (role || '').toLowerCase()
  if (normalized === 'admin') return 'ADMIN'
  if (normalized === 'jury') return 'JURY'
  return 'CANDIDAT'
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.email) {
    errorMessage.value = "L'adresse email est requise pour inviter un utilisateur."
    return
  }

  loading.value = true
  try {
    const backendRole = mapRoleToBackend(form.role)
    const res = await authStore.inviteUser({
      email: form.email,
      role: backendRole,
    })

    successMessage.value =
      res?.detail || `Invitation envoyée avec succès à ${form.email} (${backendRole}).`

    setTimeout(() => {
      router.push('/gestion-utilisateurs')
    }, 2000)
  } catch (err) {
    errorMessage.value =
      authStore.error || "Erreur lors de l'envoi de l'invitation à l'utilisateur."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.dashboard-page {
  display: flex;
  min-height: 100vh;
  background-color: #F8FAFB;
  font-family: 'Inter', Arial, sans-serif;
}

/* =========================
   MAIN CONTENT
========================= */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* =========================
   TOP BAR
========================= */
.topbar {
  background: #FFFFFF;
  border-bottom: 1px solid #E3EAED;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;
}

.back-link {
  color: #6B7280;
  text-decoration: none;
  font-size: 18px;
}

.breadcrumb-separator {
  color: #DCE4E7;
}

.breadcrumb-parent {
  font-weight: 500;
  color: #111827;
}

.breadcrumb-current {
  color: #87959B;
  font-weight: 500;
}

.btn-create-account {
  background-color: #00313C;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-create-account:hover {
  background-color: #004452;
}

/* =========================
   CONTENT BODY
========================= */
.content-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.two-col-layout {
  display: flex;
  gap: 16px;
}

.col-main {
  flex: 0 0 70%;
  max-width: 70%;
}

.col-sidebar {
  flex: 0 0 calc(30% - 16px);
  max-width: calc(30% - 16px);
}

/* =========================
   CARDS
========================= */
.card {
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E3EAED;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  margin-bottom: 16px;
}

.card-dark {
  background: #00313C;
  border-color: #00313C;
}

.card-header {
  padding: 20px 24px 0;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.card-dark .card-title {
  color: #FFFFFF;
}

.card-subtitle {
  font-size: 13px;
  color: #87959B;
  margin: 4px 0 0;
}

.card-body {
  padding: 20px 24px;
}

/* =========================
   PROFILE UPLOAD
========================= */
.profile-upload {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.upload-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: #F5F8FA;
  border: 2px dashed #E3EAED;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #87959B;
  font-size: 24px;
  flex-shrink: 0;
}

.upload-info {
  flex: 1;
}

.upload-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.upload-desc {
  font-size: 12px;
  color: #87959B;
  margin: 4px 0 0;
}

.upload-hint {
  font-size: 11px;
  color: #87959B;
  margin: 2px 0 0;
}

.btn-upload {
  background-color: #D20C4F;
  color: #FFFFFF;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.btn-upload:hover {
  background-color: #b01a3f;
}

/* =========================
   FORMULAIRE
========================= */
.divider {
  border: none;
  border-top: 1px solid #E3EAED;
  margin: 20px 0;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 6px;
}

.form-control {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #E3EAED;
  border-radius: 8px;
  background-color: #F5F8FA;
  font-size: 13px;
  color: #111827;
  outline: none;
  transition: border-color 0.15s;
}

.form-control:focus {
  border-color: #D20C4F;
}

.form-control[readonly] {
  background-color: #F5F8FA;
  color: #6B7280;
}

/* Radio */
.radio-group {
  display: flex;
  gap: 16px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
}

.radio-item input {
  display: none;
}

.radio-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #DCE4E7;
  position: relative;
  transition: border-color 0.15s;
}

.radio-item.active .radio-dot {
  border-color: #D20C4F;
}

.radio-item.active .radio-dot::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #D20C4F;
}

/* =========================
   PERMISSIONS
========================= */
.permission-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.permission-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.permission-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.permission-title {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.permission-desc {
  font-size: 11px;
  color: #87959B;
}

/* =========================
   TOGGLE
========================= */
.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.toggle input {
  display: none;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #DCE4E7;
  border-radius: 24px;
  transition: 0.2s;
}

.toggle-slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.2s;
}

.toggle input:checked + .toggle-slider {
  background-color: #D20C4F;
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

/* =========================
   SÉCURITÉ
========================= */
.security-section {
  margin-bottom: 16px;
}

.security-section:last-child {
  margin-bottom: 0;
}

.security-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.security-icon {
  color: #D20C4F;
  font-size: 16px;
}

.security-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.8);
  letter-spacing: 0.5px;
}

.divider-dark {
  border-top-color: rgba(255,255,255,0.1);
}

.password-field {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.password-mask {
  flex: 1;
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 2px;
}

.btn-eye {
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  padding: 0;
  font-size: 16px;
}

.security-hint {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  margin: 0;
  line-height: 1.4;
}

.last-login {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge-new {
  display: inline-block;
  background: rgba(210, 12, 79, 0.2);
  color: #D20C4F;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.last-login-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.last-login-label {
  color: rgba(255,255,255,0.5);
}

.last-login-value {
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

/* =========================
   AIDE ET DOCUMENTATION
========================= */
.help-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #D20C4F;
  text-decoration: none;
  margin-bottom: 10px;
  font-weight: 500;
}

.help-link:hover {
  text-decoration: underline;
}

.help-link i {
  font-size: 16px;
}

.import-zone {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E3EAED;
}

.import-title {
  font-size: 11px;
  font-weight: 700;
  color: #87959B;
  margin: 0;
  letter-spacing: 0.5px;
}

.import-desc {
  font-size: 12px;
  color: #6B7280;
  margin: 4px 0 12px;
}

.import-dashed {
  border: 2px dashed #E3EAED;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  color: #87959B;
  font-size: 24px;
}

/* =========================
   ACTION BAR
========================= */
.action-bar {
  background: #FFFFFF;
  border-top: 1px solid #E3EAED;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
}

.action-info {
  font-size: 12px;
  color: #87959B;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  background: #FFFFFF;
  border: 1px solid #E3EAED;
  color: #6B7280;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary-action {
  background: #FFFFFF;
  border: 1px solid #E3EAED;
  color: #111827;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary-action {
  background: #D20C4F;
  border: none;
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary-action:hover {
  background-color: #b01a3f;
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 1200px) {
  .two-col-layout {
    flex-direction: column;
  }
  .col-main,
  .col-sidebar {
    flex: 1 1 auto;
    max-width: 100%;
  }
}
</style>
