<template>
  <div class="layout">
    <Sidebar active-view="utilisateurs" />

    <main class="main">
      <header class="header">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Search team members, roles or departments..." />
        </div>
        <div class="header-actions">
          <button class="icon-btn notification-btn">
            <i class="bi bi-bell"></i>
            <span class="notification-dot"></span>
          </button>
          <div class="user-pill">
            <div class="avatar">
              <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.displayName)}&background=D20C4F&color=fff&size=32`" :alt="authStore.displayName" />
            </div>
            <div class="user-meta">
              <span class="user-name">{{ authStore.displayName }}</span>
              <span class="user-role">{{ authStore.userRole || 'Utilisateur' }}</span>
            </div>
            <i class="bi bi-chevron-down user-chevron"></i>
          </div>
        </div>
      </header>

      <div class="content">
        <!-- Error alert -->
        <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center py-2 px-3 mb-3" style="font-size: 13px; border-radius: 8px;">
          <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{{ errorMessage }}</div>
        </div>

        <!-- Loading -->
        <div v-else-if="isLoading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p class="text-muted mt-2 mb-0" style="font-size: 13px">Chargement du profil utilisateur...</p>
        </div>

        <!-- Content -->
        <template v-else-if="user">
          <div class="page-header">
            <div>
              <h1 class="page-title">Détail utilisateur</h1>
              <p class="page-subtitle">Consultez les informations et l'activité de ce membre de l'équipe.</p>
            </div>
            <div class="page-actions">
              <router-link :to="{ path: '/creation-utilisateur', query: { id: user.id } }" class="btn-secondary" style="text-decoration:none;">
                <i class="bi bi-pencil-square"></i>
                Modifier
              </router-link>
              <router-link to="/creation-utilisateur" class="btn-primary" style="text-decoration:none;">
                <i class="bi bi-person-plus"></i>
                Ajouter un membre
              </router-link>
            </div>
          </div>

          <div class="profile-card">
            <div class="profile-header">
              <div class="profile-avatar">
                <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00313C&color=fff&size=80`" :alt="user.name" />
              </div>
              <div class="profile-main">
                <div class="profile-name">{{ user.name }}</div>
                <div class="profile-subtitle">{{ roleLabel(user.role) }}</div>
                <div class="profile-meta">
                  <span class="profile-divider">•</span>
                  <span class="profile-status">
                    <span class="status-dot" :class="user.is_active ? 'bg-success' : 'bg-secondary'"></span>
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
              <div class="profile-badges">
                <span class="badge role" :class="roleBadgeClass(user.role)">{{ roleLabel(user.role) }}</span>
              </div>
            </div>

            <div class="profile-grid">
              <div class="profile-section">
                <h3 class="section-title">Informations personnelles</h3>
                <div class="info-list">
                  <div class="info-item">
                    <span class="info-label">Nom complet</span>
                    <span class="info-value">{{ user.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Adresse email</span>
                    <span class="info-value">{{ user.email }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Téléphone</span>
                    <span class="info-value">{{ user.phone || '—' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Référentiel</span>
                    <span class="info-value">{{ user.referentiel || '—' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Rôle</span>
                    <span class="info-value">{{ roleLabel(user.role) }}</span>
                  </div>
                </div>
              </div>

              <div class="profile-section">
                <h3 class="section-title">Activité récente</h3>
                <div class="activity-list">
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="bi bi-browser-chrome"></i>
                    </div>
                    <div class="activity-text">
                      <div class="activity-main">Connexion via Chrome</div>
                      <div class="activity-time">{{ user.lastLogin || 'Jamais' }}</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="bi bi-file-earmark-text"></i>
                    </div>
                    <div class="activity-text">
                      <div class="activity-main">Mise à jour du profil</div>
                      <div class="activity-time">{{ user.lastLogin || 'Jamais' }}</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="bi bi-people"></i>
                    </div>
                    <div class="activity-text">
                      <div class="activity-main">Ajouté à l'équipe</div>
                      <div class="activity-time">{{ user.dateJoined || 'Jamais' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bottom-cards">
            <div class="bottom-card primary">
              <div class="bottom-content">
                <div class="bottom-icon">
                  <i class="bi bi-send"></i>
                </div>
                <h3 class="bottom-title">Invitation groupée des membres de l'équipe.</h3>
                <p class="bottom-desc">Invitez plusieurs utilisateurs à la fois à l'aide d'un fichier CSV ou d'une invitation directe d'une liste.</p>
                <button class="btn-white">Lancer l'invitation groupée</button>
              </div>
              <div class="bottom-bg">
                <i class="bi bi-people-fill"></i>
              </div>
            </div>

            <div class="bottom-card secondary">
              <div class="bottom-icon">
                <i class="bi bi-shield-check"></i>
              </div>
              <h3 class="bottom-title">Permissions et rôles</h3>
              <p class="bottom-desc">Définissez des niveaux d'accès personnalisés pour contrôler précisément les permissions système.</p>
              <button class="btn-dark">Configurer les permissions</button>
            </div>
          </div>
        </template>

        <div v-else class="text-center py-5">
          <span class="text-muted" style="font-size: 13px;">Utilisateur introuvable.</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { getUserById } from '@/services/userService'

const route = useRoute()
const authStore = useAuthStore()

const rawUser = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const roleLabels = {
  ADMIN: 'Administrateur',
  CANDIDAT: 'Candidat',
  JURY: 'Jury',
}

const roleBadgeClasses = {
  ADMIN: 'role-admin',
  CANDIDAT: 'role-candidate',
  JURY: 'role-jury',
}

const roleLabel = (role) => {
  return roleLabels[role] || role || '—'
}

const roleBadgeClass = (role) => {
  return roleBadgeClasses[role] || ''
}

const user = computed(() => {
  if (!rawUser.value) return null
  const fullName =
    rawUser.value.first_name && rawUser.value.last_name
      ? `${rawUser.value.first_name} ${rawUser.value.last_name}`.trim()
      : rawUser.value.first_name ||
        rawUser.value.last_name ||
        rawUser.value.email?.split('@')[0] ||
        'Utilisateur'

  return {
    id: rawUser.value.id,
    name: fullName,
    email: rawUser.value.email || '',
    role: rawUser.value.role || 'CANDIDAT',
    is_active: rawUser.value.is_active ?? true,
    phone: rawUser.value.phone_number || '',
    referentiel: rawUser.value.referentiel || '',
    lastLogin: rawUser.value.last_login
      ? new Date(rawUser.value.last_login).toLocaleDateString('fr-FR')
      : 'Jamais',
    dateJoined: rawUser.value.date_joined
      ? new Date(rawUser.value.date_joined).toLocaleDateString('fr-FR')
      : '—',
  }
})

const userId = Number(route.params.id)

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await getUserById(userId)
    rawUser.value = response.data
  } catch (error) {
    const status = error.response?.status
    const detail = error.response?.data?.detail
    if (status === 401) {
      errorMessage.value = "Votre session a expiré. Veuillez vous reconnecter."
    } else if (status === 403) {
      errorMessage.value = "Vous n'avez pas l'autorisation de consulter cet utilisateur."
    } else if (status === 404) {
      errorMessage.value = "Utilisateur introuvable."
    } else if (status === 500) {
      errorMessage.value = "Une erreur serveur est survenue."
    } else {
      errorMessage.value = detail || "Erreur lors du chargement de l'utilisateur."
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.layout {
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  font-family: 'Inter', Arial, sans-serif;
  background: #F8FAFC;
  overflow: hidden;
}

.main {
  flex: 1;
  min-width: 0;
  width: calc(100vw - 256px);
  max-width: calc(100vw - 256px);
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  overflow: hidden;
}

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 28px;
  background: #FFFFFF;
  border-bottom: 1px solid #EEF2F5;
  width: 100%;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 340px;
  padding: 10px 14px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: #00313C;
}

.search-box i {
  color: #94A3B8;
  font-size: 14px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #0F172A;
  width: 100%;
  font-family: inherit;
}

.search-box input::placeholder {
  color: #94A3B8;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  color: #475569;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.15s;
}

.icon-btn:hover {
  border-color: #00313C;
  color: #00313C;
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #D20C4F;
  border: 2px solid #FFFFFF;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  cursor: pointer;
  transition: border-color 0.15s;
}

.user-pill:hover {
  border-color: #CBD5E1;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
}

.user-role {
  font-size: 11px;
  color: #64748B;
}

.user-chevron {
  font-size: 12px;
  color: #94A3B8;
}

.content {
  flex: 1;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #00313C;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 13px;
  color: #64748B;
  margin: 0;
  max-width: 520px;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  background: #D20C4F;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(210,12,79,0.18);
  transition: background 0.2s;
  font-family: inherit;
}

.btn-primary:hover {
  background: #b01a3f;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  background: #FFFFFF;
  color: #00313C;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-secondary:hover {
  background: #F8FAFC;
  border-color: #00313C;
}

.profile-card {
  background: #FFFFFF;
  border: 1px solid #EEF2F5;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F1F5F9;
  margin-bottom: 24px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid #F8FAFC;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.profile-subtitle {
  font-size: 13px;
  color: #64748B;
}

.profile-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.profile-divider {
  color: #CBD5E1;
  font-size: 12px;
}

.profile-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #16A34A;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}

.profile-badges {
  display: flex;
  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 9px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.role {
  letter-spacing: 0.06em;
}

.role-admin {
  background: #EFF6FF;
  color: #1D4ED8;
}

.role-jury {
  background: #F3E8FF;
  color: #7C3AED;
}

.role-candidate {
  background: #DCFCE7;
  color: #16A34A;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #00313C;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #F1F5F9;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 13px;
  color: #64748B;
}

.info-value {
  font-size: 13px;
  color: #0F172A;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  background: #F8FAFC;
  border: 1px solid #EEF2F5;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #FFFFFF;
  border: 1px solid #EEF2F5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00313C;
  font-size: 16px;
  flex-shrink: 0;
}

.activity-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-main {
  font-size: 13px;
  color: #0F172A;
  font-weight: 600;
}

.activity-time {
  font-size: 11px;
  color: #94A3B8;
}

.bottom-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.bottom-card {
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  min-height: 180px;
}

.bottom-card.primary {
  background: #00313C;
  color: #FFFFFF;
  border: none;
}

.bottom-content {
  position: relative;
  z-index: 2;
  max-width: 65%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bottom-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 4px;
}

.bottom-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
}

.bottom-desc {
  font-size: 12px;
  color: rgba(255,255,255,0.72);
  line-height: 1.5;
  margin: 0;
}

.btn-white {
  margin-top: 4px;
  align-self: flex-start;
  background: #FFFFFF;
  color: #00313C;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-white:hover {
  background: #F1F5F9;
}

.bottom-bg {
  position: absolute;
  right: 20px;
  bottom: 20px;
  font-size: 90px;
  opacity: 0.08;
  color: #FFFFFF;
  z-index: 1;
}

.bottom-card.secondary {
  background: #FFFFFF;
  border: 2px dashed #FECDD3;
  color: #0F172A;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bottom-card.secondary .bottom-icon {
  background: #FEF2F2;
  color: #D20C4F;
}

.bottom-card.secondary .bottom-desc {
  color: #64748B;
}

.btn-dark {
  align-self: flex-start;
  background: #00313C;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-dark:hover {
  background: #004D61;
}

@media (max-width: 1200px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  .bottom-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .main {
    width: calc(100vw - 256px);
    max-width: calc(100vw - 256px);
  }
  .content {
    padding: 20px;
  }
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  .profile-badges {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .main {
    width: 100vw;
    max-width: 100vw;
  }
  .header {
    padding: 12px 16px;
    height: auto;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  .search-box {
    width: 100%;
  }
}
</style>
