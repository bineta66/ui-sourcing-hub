<template>
  <div class="layout">
    <Sidebar />

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
            <h1 class="page-title">Gestion des comptes</h1>
            <p class="page-subtitle">Gérez l'accès à votre espace de travail, les rôles et les permissions de l'équipe</p>
          </div>
          <router-link to="/creation-utilisateur" class="btn-primary" style="text-decoration:none;">
            <i class="bi bi-person-plus"></i>
            Ajouter un membre de l'équipe
          </router-link>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-icon" style="background:#EFF6FF;color:#00313C;">
              <i class="bi bi-people"></i>
            </div>
            <div class="stat-text">
              <span class="stat-label">UTILISATEURS TOTAL</span>
              <span class="stat-value">42 Utilisateurs</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#DCFCE7;color:#16A34A;">
              <i class="bi bi-check-circle-fill"></i>
            </div>
            <div class="stat-text">
              <span class="stat-label">ACTIF MAINTENANT</span>
              <span class="stat-value">18 Actifs</span>
            </div>
          </div>
         
          <div class="stat-card">
            <div class="stat-icon" style="background:#FFF7ED;color:#F59E0B;">
              <i class="bi bi-hourglass-split"></i>
            </div>
            <div class="stat-text">
              <span class="stat-label">EN ATTENTE</span>
              <span class="stat-value">03 Invitations</span>
            </div>
          </div>
        </div>

        <div class="filters">
          <div class="filters-left">
            <div class="filter-pill">
              <span class="filter-label">Rôle :</span>
              <select class="filter-select">
                <option>Tous</option>
                <option>admin</option>
                <option>jury</option>
                <option>candidate</option>
              </select>
              <i class="bi bi-chevron-down filter-arrow"></i>
            </div>
            <div class="filter-pill">
              <span class="filter-label">Statut :</span>
              <select class="filter-select">
                <option>Actif</option>
                <option>Inactif</option>
                <option>En attente</option>
              </select>
              <i class="bi bi-chevron-down filter-arrow"></i>
            </div>
            <button class="filter-reset">Filters</button>
          </div>
          <div class="view-switch">
            <button class="view-option active">
              <i class="bi bi-grid"></i>
              <span>grille</span>
            </button>
            <button class="view-option">
              <i class="bi bi-list"></i>
              <span>Vue en liste</span>
            </button>
          </div>
        </div>

        <div class="table-card">
          <table class="table">
            <thead>
              <tr>
                <th>MEMBRE DE L'ÉQUIPE</th>
                <th>ADRESSE E-MAIL</th>
                <th>RÔLE</th>
                <th>STATUT</th>
                <th>DERNIÈRE ACTIVITÉ</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>
                  <div class="member">
                    <div class="member-avatar">
                      <img :src="user.avatar" :alt="user.name" />
                    </div>
                    <div class="member-info">
                      <div class="member-name">{{ user.name }}</div>
                      <div class="member-sub">{{ user.subtitle }}</div>
                    </div>
                  </div>
                </td>
                <td class="email-cell">{{ user.email }}</td>
                <td>
                  <span class="badge role" :class="user.roleClass">{{ user.role }}</span>
                </td>
                <td>
                  <span class="badge status" :class="user.statusClass">
                    <span class="dot"></span>
                    {{ user.status }}
                  </span>
                </td>
                <td>
                  <div class="activity">
                    <div class="activity-main">{{ user.activity }}</div>
                    <div class="activity-sub">{{ user.browser }}</div>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <button class="action-btn" title="Modifier" @click="goToEdit(user.id)"><i class="bi bi-pencil-square"></i></button>
                    <button class="action-btn" title="Consulter" @click="goToDetail(user.id)"><i class="bi bi-eye"></i></button>
                    <button class="action-btn" :class="user.actionClass" :title="user.actionTitle">
                      <i :class="user.actionIcon"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <span class="pagination-info">Affichage de 1 à 10 sur 42 membres de l'équipe</span>
          <div class="pagination-controls">
            <button class="page-link" disabled><i class="bi bi-chevron-left"></i></button>
            <button class="page-link active">1</button>
            <button class="page-link">2</button>
            <button class="page-link">3</button>
            <button class="page-link disabled"><i class="bi bi-three-dots"></i></button>
            <button class="page-link">5</button>
            <button class="page-link"><i class="bi bi-chevron-right"></i></button>
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
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    avatar: 'https://ui-avatars.com/api/?name=David+Richardson&background=00313C&color=fff&size=40',
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
    avatar: 'https://ui-avatars.com/api/?name=Eleanor+Rigby&background=6B7280&color=fff&size=40',
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
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Aurelius&background=F59E0B&color=fff&size=40',
    actionClass: 'action-rose',
    actionTitle: 'Activer',
    actionIcon: 'bi bi-play-fill'
  },
  {
    id: 4,
    name: 'Elena Martinez',
    subtitle: 'Talent Sourcing',
    email: 'elena.m@recruit.ai',
    role: 'candidate',
    roleClass: 'role-candidate',
    status: 'ACTIVE',
    statusClass: 'status-active',
    activity: 'Online Now',
    browser: 'Desktop Chrome',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Martinez&background=16A34A&color=fff&size=40',
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
    avatar: 'https://ui-avatars.com/api/?name=Julian+Chen&background=64748B&color=fff&size=40',
    actionClass: '',
    actionTitle: 'Désactiver',
    actionIcon: 'bi bi-power'
  }
]

const goToEdit = (id) => {
  router.push(`/creation-utilisateur?id=${id}`)
}

const goToDetail = (id) => {
  router.push(`/detail-utilisateur/${id}`)
}
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
  margin-left: 220px;
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
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
  border: 1px solid #D20C4F;
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

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #FFFFFF;
  border: 1px solid #EEF2F5;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.stat-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: #64748B;
  letter-spacing: 0.08em;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #00313C;
  letter-spacing: -0.01em;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
  background: #FFFFFF;
  border: 1px solid #EEF1F4;
  border-radius: 10px;
  padding: 0 12px;
}

.filters-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  background: #F8FAFC;
  border: 1px solid #EEF1F4;
  border-radius: 7px;
  font-size: 12px;
  color: #334155;
}

.filter-label {
  font-weight: 600;
  color: #00313C;
  font-size: 12px;
}

.filter-select {
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  color: #64748B;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
}

.filter-arrow {
  font-size: 10px;
  color: #94A3B8;
  margin-left: 2px;
}

.filter-reset {
  background: transparent;
  border: none;
  color: #D20C4F;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 6px;
  font-family: inherit;
  white-space: nowrap;
}

.view-switch {
  display: flex;
  align-items: center;
  height: 34px;
  background: #FFFFFF;
  border: 1px solid #EEF1F4;
  border-radius: 8px;
  overflow: hidden;
}

.view-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 100%;
  padding: 0 12px;
  background: transparent;
  border: none;
  color: #94A3B8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  white-space: nowrap;
}

.view-option.active {
  background: #FFFFFF;
  color: #00313C;
  font-weight: 600;
}

.view-option i {
  font-size: 14px;
}

.table-card {
  background: #FFFFFF;
  border: 1px solid #EEF2F5;
  border-radius: 15px;
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table thead {
  background: #F8FAFC;
}

.table th {
  text-align: left;
  padding: 14px 20px;
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid #EEF2F5;
  white-space: nowrap;
}

.table td {
  padding: 14px 20px;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
  color: #334155;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background: #FAFBFC;
}

.member {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.member-name {
  font-weight: 600;
  color: #0F172A;
  font-size: 13px;
}

.member-sub {
  font-size: 12px;
  color: #64748B;
}

.email-cell {
  color: #64748B;
  font-size: 13px;
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

.status {
  gap: 6px;
}

.status-active {
  background: #DCFCE7;
  color: #16A34A;
}

.status-inactive {
  background: #F1F5F9;
  color: #94A3B8;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}

.activity {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-main {
  font-size: 13px;
  color: #334155;
  white-space: nowrap;
}

.activity-sub {
  font-size: 11px;
  color: #94A3B8;
}

.actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #EEF2F5;
  background: #FFFFFF;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
  color: #00313C;
}

.action-rose {
  color: #D20C4F;
  border-color: #FECDD3;
}

.action-rose:hover {
  background: #FFF1F2;
  border-color: #FDA4AF;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.pagination-info {
  font-size: 13px;
  color: #64748B;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.page-link {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #EEF2F5;
  background: #FFFFFF;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  padding: 0 8px;
  font-family: inherit;
}

.page-link:hover:not(.active):not(.disabled) {
  background: #F8FAFC;
  border-color: #00313C;
  color: #00313C;
}

.page-link.active {
  background: #00313C;
  border-color: #00313C;
  color: #FFFFFF;
}

.page-link.disabled {
  opacity: 0.4;
  cursor: not-allowed;
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
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.01em;
}

.bottom-desc {
  font-size: 11px;
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
  .stats {
    grid-template-columns: repeat(2, 1fr);
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
  .stats {
    grid-template-columns: 1fr;
  }
  .page-header {
    flex-direction: column;
    gap: 14px;
  }
  .table-card {
    overflow-x: auto;
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
  .filters {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  .pagination {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
