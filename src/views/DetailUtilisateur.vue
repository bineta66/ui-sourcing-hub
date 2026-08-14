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
              <img src="https://ui-avatars.com/api/?name=Ndeye&background=D20C4F&color=fff&size=32" alt="Ndeye" />
            </div>
            <div class="user-meta">
              <span class="user-name">Ndeye</span>
              <span class="user-role">Recruitment Supervisor</span>
            </div>
            <i class="bi bi-chevron-down user-chevron"></i>
          </div>
        </div>
      </header>

      <div class="content">
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
            <router-link :to="{ path: '/creation-utilisateur', query: { id: user.id } }" class="btn-primary" style="text-decoration:none;">
              <i class="bi bi-person-plus"></i>
              Ajouter un membre
            </router-link>
          </div>
        </div>

        <div class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar">
              <img :src="user.avatar" :alt="user.name" />
            </div>
            <div class="profile-main">
              <div class="profile-name">{{ user.name }}</div>
              <div class="profile-subtitle">{{ user.subtitle }}</div>
              <div class="profile-meta">
                <span class="profile-divider">•</span>
                <span class="profile-status">
                  <span class="status-dot"></span>
                  {{ user.status }}
                </span>
              </div>
            </div>
            <div class="profile-badges">
              <span class="badge role" :class="user.roleClass">{{ user.role }}</span>
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
                  <span class="info-value">{{ user.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Référentiel</span>
                  <span class="info-value">{{ user.referentiel }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Rôle</span>
                  <span class="info-value">{{ user.subtitle }}</span>
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
                    <div class="activity-time">{{ user.activity }}</div>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-icon">
                    <i class="bi bi-file-earmark-text"></i>
                  </div>
                  <div class="activity-text">
                    <div class="activity-main">Mise à jour du profil</div>
                    <div class="activity-time">1 hour ago</div>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-icon">
                    <i class="bi bi-people"></i>
                  </div>
                  <div class="activity-text">
                    <div class="activity-main">Ajouté à l'équipe</div>
                    <div class="activity-time">3 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

     

      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const users = [
  {
    id: 1,
    name: 'David Richardson',
    subtitle: 'Head of Sourcing',
    email: 'd.richardson@recruit.ai',
    role: 'admin',
    roleClass: 'role-admin',
    status: 'ACTIVE',
    statusClass: 'status-active',
    activity: '2 mins ago',
    browser: 'Dernière Chrome',
    phone: '+221 77 000 00 00',
    referentiel: 'Talent Acquisition',
    avatar: 'https://ui-avatars.com/api/?name=David+Richardson&background=00313C&color=fff&size=80',
    actionClass: '',
    actionTitle: 'Désactiver',
    actionIcon: 'bi bi-power'
  },
  {
    id: 2,
    name: 'Eleanor Rigby',
    subtitle: 'Recruitment Coach',
    email: 'eleanor.r@recruit.ai',
    role: 'jury',
    roleClass: 'role-jury',
    status: 'ACTIVE',
    statusClass: 'status-active',
    activity: '1 hour ago',
    browser: 'Mobile Safari',
    phone: '+221 77 000 00 01',
    referentiel: 'Talent Acquisition',
    avatar: 'https://ui-avatars.com/api/?name=Eleanor+Rigby&background=6B7280&color=fff&size=80',
    actionClass: '',
    actionTitle: 'Désactiver',
    actionIcon: 'bi bi-power'
  },
  {
    id: 3,
    name: 'Marcus Aurelius',
    subtitle: 'Compliance Expert',
    email: 'marcus.a@recruit.ai',
    role: 'candidate',
    roleClass: 'role-candidate',
    status: 'INACTIVE',
    statusClass: 'status-inactive',
    activity: '3 days ago',
    browser: 'Desktop Firefox',
    phone: '+221 77 000 00 02',
    referentiel: 'Talent Acquisition',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Aurelius&background=F59E0B&color=fff&size=80',
    actionClass: 'action-rose',
    actionTitle: 'Activer',
    actionIcon: 'bi bi-play-fill'
  },
  {
    id: 4,
    name: 'Elena Martinez',
    subtitle: 'Talent Sourcing',
    email: 'elena.m@recruit.ai',
    role: 'SOURCING',
    roleClass: 'role-sourcing',
    status: 'ACTIVE',
    statusClass: 'status-active',
    activity: 'Online Now',
    browser: 'Desktop Chrome',
    phone: '+221 77 000 00 03',
    referentiel: 'Talent Acquisition',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Martinez&background=16A34A&color=fff&size=80',
    actionClass: '',
    actionTitle: 'Désactiver',
    actionIcon: 'bi bi-power'
  },
  {
    id: 5,
    name: 'Julian Chen',
    subtitle: 'Recruitment Coach',
    email: 'j.chen@recruit.ai',
    role: 'jury',
    roleClass: 'role-jury',
    status: 'ACTIVE',
    statusClass: 'status-active',
    activity: '10 hours ago',
    browser: 'Desktop Chrome',
    phone: '+221 77 000 00 04',
    referentiel: 'Talent Acquisition',
    avatar: 'https://ui-avatars.com/api/?name=Julian+Chen&background=64748B&color=fff&size=80',
    actionClass: '',
    actionTitle: 'Désactiver',
    actionIcon: 'bi bi-power'
  }
]

const user = users.find(u => u.id === Number(route.params.id)) || users[0]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', Arial, sans-serif;
  background: #F8FAFC;
}

.main {
 
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 28px;
  background: #FFFFFF;
  border-bottom: 1px solid #EEF2F5;
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
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.profile-email {
  font-size: 13px;
  color: #64748B;
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
  background: #16A34A;
  display: inline-block;
}

.profile-badges {
  display: flex;
  gap: 8px;
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
    margin-left: 0;
  }
  .content {
    padding: 20px;
  }
  .page-header {
    flex-direction: column;
    gap: 14px;
  }
}

@media (max-width: 768px) {
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
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  .profile-badges {
    justify-content: center;
  }
}
</style>
