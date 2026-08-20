<template>
  <div class="layout">
    <!-- SIDEBAR -->
    <Sidebar active-view="utilisateurs" />

    <!-- MAIN -->
    <main class="main">

      <!-- HEADER FIXE -->
      <header class="header">

        <div class="search-box">
          <i class="bi bi-search"></i>

          <input
            type="text"
            v-model="search"
            placeholder="Rechercher un utilisateur..."
          />
        </div>

        <div class="header-actions">

          <button class="icon-btn notification-btn">
            <i class="bi bi-bell"></i>
            <span class="notification-dot"></span>
          </button>

          <div class="user-pill">

            <div class="avatar">
              <img
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.displayName)}&background=D20C4F&color=fff&size=32`"
                :alt="authStore.displayName"
              />
            </div>

            <div class="user-meta">
              <span class="user-name">
                {{ authStore.displayName }}
              </span>

              <span class="user-role">
                {{ authStore.userRole || 'Utilisateur' }}
              </span>
            </div>

            <i class="bi bi-chevron-down user-chevron"></i>

          </div>

        </div>
      </header>

      <!-- CONTENU SCROLLABLE -->
      <div class="content">

        <!-- TITRE -->
        <div class="page-header">

          <div>
            <h1 class="page-title">
              Gestion des comptes
            </h1>

            <p class="page-subtitle">
              Gérez l'accès à votre espace de travail, les rôles et les permissions de l'équipe
            </p>
          </div>

          <router-link
            to="/creation-utilisateur"
            class="btn-primary"
          >
            <i class="bi bi-person-plus"></i>
            Ajouter un membre de l'équipe
          </router-link>

        </div>

        <!-- MESSAGE ERREUR -->
        <div
          v-if="errorMessage"
          class="alert alert-danger d-flex align-items-center py-2 px-3 mb-0"
          style="font-size: 13px; border-radius: 8px;"
        >
          <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>

          <div>
            {{ errorMessage }}
          </div>
        </div>

        <!-- STATISTIQUES -->
        <div class="stats">

          <!-- TOTAL -->
          <div class="stat-card">

            <div
              class="stat-icon"
              style="background:#EFF6FF;color:#00313C;"
            >
              <i class="bi bi-people"></i>
            </div>

            <div class="stat-text">

              <span class="stat-label">
                UTILISATEURS TOTAL
              </span>

              <span class="stat-value">
                {{ usersStore.count }} Utilisateurs
              </span>

            </div>

          </div>

          <!-- ACTIFS -->
          <div class="stat-card">

            <div
              class="stat-icon"
              style="background:#DCFCE7;color:#16A34A;"
            >
              <i class="bi bi-check-circle-fill"></i>
            </div>

            <div class="stat-text">

              <span class="stat-label">
                ACTIF MAINTENANT
              </span>

              <span class="stat-value">
                {{ usersStore.activeCount }} Actifs
              </span>

            </div>

          </div>

          <!-- INACTIFS -->
          <div class="stat-card">

            <div
              class="stat-icon"
              style="background:#FFF7ED;color:#F59E0B;"
            >
              <i class="bi bi-hourglass-split"></i>
            </div>

            <div class="stat-text">

              <span class="stat-label">
                EN ATTENTE
              </span>

              <span class="stat-value">
                {{ usersStore.inactiveCount }} Inactifs
              </span>

            </div>

          </div>

        </div>

        <!-- FILTRES -->
        <div class="filters">

          <div class="filters-left">

            <!-- ROLE -->
            <div class="filter-pill">

              <span class="filter-label">
                Rôle :
              </span>

              <select
                class="filter-select"
                v-model="roleFilter"
              >

                <option value="all">
                  Tous
                </option>

                <option value="ADMIN">
                  Administrateur
                </option>

                <option value="JURY">
                  Jury
                </option>

                <option value="CANDIDAT">
                  Candidat
                </option>

              </select>

              <i class="bi bi-chevron-down filter-arrow"></i>

            </div>

            <!-- STATUT -->
            <div class="filter-pill">

              <span class="filter-label">
                Statut :
              </span>

              <select
                class="filter-select"
                v-model="statusFilter"
              >

                <option value="all">
                  Tous
                </option>

                <option value="active">
                  Actif
                </option>

                <option value="inactive">
                  Inactif
                </option>

              </select>

              <i class="bi bi-chevron-down filter-arrow"></i>

            </div>

            <!-- RESET -->
            <button
              class="filter-reset"
              @click="resetFilters"
            >
              Réinitialiser
            </button>

          </div>

          <!-- VUE -->
          <div class="view-switch">

            <button class="view-option active">
              <i class="bi bi-grid"></i>
              <span>Grille</span>
            </button>

            <button class="view-option">
              <i class="bi bi-list"></i>
              <span>Vue en liste</span>
            </button>

          </div>

        </div>

        <!-- TABLEAU -->
        <div class="table-card">

          <!-- CHARGEMENT -->
          <div
            v-if="isLoading"
            class="loading-container"
          >

            <div
              class="spinner-border"
              role="status"
            >
              <span class="visually-hidden">
                Chargement...
              </span>
            </div>

            <p>
              Chargement des utilisateurs...
            </p>

          </div>

          <!-- AUCUN UTILISATEUR -->
          <div
            v-else-if="paginatedUsers.length === 0"
            class="empty-container"
          >

            <i class="bi bi-people"></i>

            <p>
              Aucun utilisateur trouvé.
            </p>

          </div>

          <!-- TABLE -->
          <div
            v-else
            class="table-wrapper"
          >

            <table class="user-table">

              <!-- EN-TÊTE -->
              <thead>

                <tr>

                  <th>
                    MEMBRE DE L'ÉQUIPE
                  </th>

                  <th>
                    ADRESSE E-MAIL
                  </th>

                  <th>
                    RÔLE
                  </th>

                  <th>
                    STATUT
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <!-- CORPS -->
              <tbody>

                <tr
                  v-for="user in paginatedUsers"
                  :key="user.id"
                >

                  <!-- MEMBRE -->
                  <td>

                    <div class="member">

                      <div class="member-avatar">

                        <img
                          :src="avatarUrl(user)"
                          :alt="user.name"
                        />

                      </div>

                      <div class="member-info">

                        <div class="member-name">
                          {{ user.name }}
                        </div>

                        <div class="member-sub">
                          {{ roleLabel(user.role) }}
                        </div>

                      </div>

                    </div>

                  </td>

                  <!-- EMAIL -->
                  <td class="email-cell">
                    {{ user.email }}
                  </td>

                  <!-- ROLE -->
                  <td>

                    <span
                      class="badge role"
                      :class="roleBadgeClass(user.role)"
                    >
                      {{ roleLabel(user.role) }}
                    </span>

                  </td>

                  <!-- STATUT -->
                  <td>

                    <span
                      class="badge status"
                      :class="statusClass(user.is_active)"
                    >

                      <span class="dot"></span>

                      {{ user.is_active ? 'Active' : 'Inactive' }}

                    </span>

                  </td>

                  <!-- ACTIONS -->
                  <td>

                    <div class="actions">

                      <!-- VOIR -->
                      <button
                        class="action-btn"
                        title="Voir"
                        @click="viewUser(user.id)"
                      >
                        <i class="bi bi-eye"></i>
                      </button>

                      <!-- MODIFIER -->
                      <button
                        class="action-btn"
                        title="Modifier"
                        @click="editUser(user.id)"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>

                      <!-- ACTIVER / DESACTIVER -->
                      <button
                        class="action-btn"
                        :class="{
                          'action-rose': !user.is_active
                        }"
                        :title="
                          user.is_active
                            ? 'Désactiver'
                            : 'Activer'
                        "
                      >

                        <i
                          :class="
                            user.is_active
                              ? 'bi bi-power'
                              : 'bi bi-play-fill'
                          "
                        ></i>

                      </button>

                    </div>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

        <!-- PAGINATION -->
        <div
          v-if="!isLoading && filteredUsers.length > 0"
          class="pagination"
        >

          <span class="pagination-info">

            Affichage de
            {{ (currentPage - 1) * itemsPerPage + 1 }}
            à
            {{ Math.min(
              currentPage * itemsPerPage,
              filteredUsers.length
            ) }}
            sur
            {{ filteredUsers.length }}
            membres de l'équipe

          </span>

          <div class="pagination-controls">

            <!-- PREVIOUS -->
            <button
              class="page-link"
              :class="{
                disabled: currentPage === 1
              }"
              @click="prevPage"
            >
              <i class="bi bi-chevron-left"></i>
            </button>

            <!-- PAGES -->
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-link"
              :class="{
                active: page === currentPage
              }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <!-- NEXT -->
            <button
              class="page-link"
              :class="{
                disabled: currentPage === totalPages
              }"
              @click="nextPage"
            >
              <i class="bi bi-chevron-right"></i>
            </button>

          </div>

        </div>

        <!-- CARTES DU BAS -->
        <div class="bottom-cards">

          <!-- INVITATION -->
          <div class="bottom-card primary">

            <div class="bottom-content">

              <div class="bottom-icon">
                <i class="bi bi-send"></i>
              </div>

              <h3 class="bottom-title">
                Invitation groupée des membres de l'équipe.
              </h3>

              <p class="bottom-desc">
                Invitez plusieurs utilisateurs à la fois à l'aide
                d'un fichier CSV ou d'une invitation directe d'une liste.
              </p>

              <button class="btn-white">
                Lancer l'invitation groupée
              </button>

            </div>

            <div class="bottom-bg">
              <i class="bi bi-people-fill"></i>
            </div>

          </div>

          <!-- PERMISSIONS -->
          <div class="bottom-card secondary">

            <div class="bottom-icon">
              <i class="bi bi-shield-check"></i>
            </div>

            <h3 class="bottom-title">
              Permissions et rôles
            </h3>

            <p class="bottom-desc">
              Définissez des niveaux d'accès personnalisés
              pour contrôler précisément les permissions système.
            </p>

            <button class="btn-dark">
              Configurer les permissions
            </button>

          </div>

        </div>

      </div>

    </main>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  watch
} from 'vue'

import { useRouter } from 'vue-router'

import Sidebar from '@/components/Sidebar.vue'

import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

import { getUsers } from '@/services/userService'

/* =========================================================
   ROUTER
========================================================= */

const router = useRouter()

/* =========================================================
   STORES
========================================================= */

const authStore = useAuthStore()
const usersStore = useUsersStore()

/* =========================================================
   FILTRES
========================================================= */

const search = ref('')

const roleFilter = ref('all')

const statusFilter = ref('all')

/* =========================================================
   PAGINATION
========================================================= */

const currentPage = ref(1)

const itemsPerPage = 10

/* =========================================================
   ETAT
========================================================= */

const isLoading = ref(true)

const errorMessage = ref('')

/* =========================================================
   LABELS DES ROLES
========================================================= */

const roleLabels = {
  ADMIN: 'Administrateur',
  CANDIDAT: 'Candidat',
  JURY: 'Jury'
}

/* =========================================================
   CLASSES DES ROLES
========================================================= */

const roleBadgeClasses = {
  ADMIN: 'role-admin',
  CANDIDAT: 'role-candidate',
  JURY: 'role-jury'
}

/* =========================================================
   CLASSES STATUT
========================================================= */

const statusClasses = {
  true: 'status-active',
  false: 'status-inactive'
}

/* =========================================================
   UTILISATEURS MAPPÉS
========================================================= */

const mappedUsers = computed(() => {

  return usersStore.items.map((u) => {

    const name =
      u.first_name && u.last_name
        ? `${u.first_name} ${u.last_name}`.trim()
        : u.first_name ||
          u.last_name ||
          u.email?.split('@')[0] ||
          'Utilisateur'

    return {

      id: u.id,

      name,

      email: u.email || '',

      role: u.role || 'CANDIDAT',

      is_active: u.is_active ?? true

    }

  })

})

/* =========================================================
   FILTRAGE
========================================================= */

const filteredUsers = computed(() => {

  let result = mappedUsers.value

  /* Recherche */

  if (search.value) {

    const term =
      search.value.toLowerCase().trim()

    result = result.filter((u) =>

      u.name
        .toLowerCase()
        .includes(term)

      ||

      u.email
        .toLowerCase()
        .includes(term)

    )

  }

  /* Role */

  if (roleFilter.value !== 'all') {

    result = result.filter(
      (u) =>
        u.role === roleFilter.value
    )

  }

  /* Statut */

  if (statusFilter.value !== 'all') {

    result = result.filter((u) => {

      if (statusFilter.value === 'active') {
        return u.is_active
      }

      return !u.is_active

    })

  }

  return result

})

/* =========================================================
   PAGINATION
========================================================= */

const paginatedUsers = computed(() => {

  const start =
    (currentPage.value - 1) *
    itemsPerPage

  const end =
    start + itemsPerPage

  return filteredUsers.value.slice(
    start,
    end
  )

})

/* =========================================================
   NOMBRE DE PAGES
========================================================= */

const totalPages = computed(() => {

  return Math.max(
    1,
    Math.ceil(
      filteredUsers.value.length /
      itemsPerPage
    )
  )

})

/* =========================================================
   RESET PAGE QUAND FILTRE CHANGE
========================================================= */

watch(
  [
    search,
    roleFilter,
    statusFilter
  ],
  () => {

    currentPage.value = 1

  }
)

/* =========================================================
   AVATAR
========================================================= */

const avatarUrl = (user) => {

  return `
    https://ui-avatars.com/api/
    ?name=${encodeURIComponent(user.name)}
    &background=00313C
    &color=fff
    &size=40
  `.replace(/\s/g, '')

}

/* =========================================================
   LABEL ROLE
========================================================= */

const roleLabel = (role) => {

  return (
    roleLabels[role] ||
    role ||
    '—'
  )

}

/* =========================================================
   CLASSE ROLE
========================================================= */

const roleBadgeClass = (role) => {

  return roleBadgeClasses[role] || ''

}

/* =========================================================
   CLASSE STATUT
========================================================= */

const statusClass = (active) => {

  return (
    statusClasses[String(active)] ||
    ''
  )

}

/* =========================================================
   VOIR UTILISATEUR
========================================================= */

const viewUser = (id) => {

  router.push(
    `/detail-utilisateur/${id}`
  )

}

/* =========================================================
   MODIFIER UTILISATEUR
========================================================= */

const editUser = (id) => {

  router.push(
    `/creation-utilisateur?id=${id}`
  )

}

/* =========================================================
   RESET FILTRES
========================================================= */

const resetFilters = () => {

  search.value = ''

  roleFilter.value = 'all'

  statusFilter.value = 'all'

}

/* =========================================================
   PAGE PRECEDENTE
========================================================= */

const prevPage = () => {

  if (currentPage.value > 1) {

    currentPage.value--

  }

}

/* =========================================================
   PAGE SUIVANTE
========================================================= */

const nextPage = () => {

  if (
    currentPage.value <
    totalPages.value
  ) {

    currentPage.value++

  }

}

/* =========================================================
   ALLER A UNE PAGE
========================================================= */

const goToPage = (page) => {

  currentPage.value = page

}

/* =========================================================
   CHARGER LES UTILISATEURS
========================================================= */

const loadUsers = async () => {

  isLoading.value = true

  errorMessage.value = ''

  try {

    const response =
      await getUsers()

    const data = response.data

    usersStore.items =
      data.results || data

  }

  catch (error) {

    const status =
      error.response?.status

    const detail =
      error.response?.data?.detail

    if (status === 401) {

      errorMessage.value =
        'Votre session a expiré. Veuillez vous reconnecter.'

    }

    else if (status === 403) {

      errorMessage.value =
        "Vous n'avez pas l'autorisation de consulter les utilisateurs."

    }

    else if (status === 500) {

      errorMessage.value =
        'Une erreur serveur est survenue.'

    }

    else {

      errorMessage.value =
        detail ||
        'Erreur lors du chargement des utilisateurs.'

    }

  }

  finally {

    isLoading.value = false

  }

}

/* =========================================================
   MOUNT
========================================================= */

onMounted(() => {

  loadUsers()

})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* =========================================================
   LAYOUT
========================================================= */

.layout {
  display: flex;

  width: 100%;

  height: 100vh;

  min-height: 100vh;

  font-family:
    'Inter',
    Arial,
    sans-serif;

  background: #F8FAFC;

  overflow: hidden;
}

/* =========================================================
   MAIN
========================================================= */

.main {
  flex: 1;

  min-width: 0;

  min-height: 0;

  width: calc(100vw - 256px);

  max-width: calc(100vw - 256px);

  height: 100vh;

  display: flex;

  flex-direction: column;

  background: #FFFFFF;

  overflow: hidden;
}

/* =========================================================
   HEADER FIXE
========================================================= */

.header {
  flex: 0 0 72px;

  width: 100%;

  height: 72px;

  min-height: 72px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 28px;

  background: #FFFFFF;

  border-bottom:
    1px solid #EEF2F5;

  gap: 16px;

  position: relative;

  z-index: 100;

  box-sizing: border-box;
}

/* =========================================================
   SEARCH
========================================================= */

.search-box {
  display: flex;

  align-items: center;

  gap: 10px;

  width: 340px;

  padding: 10px 14px;

  background: #F8FAFC;

  border:
    1px solid #E2E8F0;

  border-radius: 10px;
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

/* =========================================================
   HEADER ACTIONS
========================================================= */

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

  border:
    1px solid #E2E8F0;

  background: #FFFFFF;

  color: #475569;

  font-size: 18px;

  cursor: pointer;
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

  border:
    2px solid #FFFFFF;
}

/* =========================================================
   USER
========================================================= */

.user-pill {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 6px 10px;

  border-radius: 10px;

  border:
    1px solid #E2E8F0;

  background: #FFFFFF;
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

/* =========================================================
   CONTENT SCROLLABLE
========================================================= */

.content {
  flex: 1 1 auto;

  min-width: 0;

  min-height: 0;

  width: 100%;

  max-width: 100%;

  padding: 28px;

  display: flex;

  flex-direction: column;

  gap: 20px;

  overflow-y: auto;

  overflow-x: hidden;

  box-sizing: border-box;

  scrollbar-width: thin;

  scrollbar-color:
    #CBD5E1
    transparent;
}

.content::-webkit-scrollbar {
  width: 7px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background: #CBD5E1;

  border-radius: 10px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

/* =========================================================
   PAGE HEADER
========================================================= */

.page-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 20px;

  flex-wrap: wrap;

  width: 100%;
}

.page-title {
  font-size: 24px;

  font-weight: 700;

  color: #00313C;

  margin: 0 0 6px;

  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 13px;

  color: #64748B;

  margin: 0;

  max-width: 520px;

  line-height: 1.5;
}

/* =========================================================
   BUTTON
========================================================= */

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

  text-decoration: none;

  box-shadow:
    0 2px 8px
    rgba(210, 12, 79, 0.18);

  font-family: inherit;
}

.btn-primary:hover {
  background: #B01A3F;

  color: #FFFFFF;
}

/* =========================================================
   STATS
========================================================= */

.stats {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 16px;

  width: 100%;
}

.stat-card {
  display: flex;

  align-items: center;

  gap: 14px;

  background: #FFFFFF;

  border:
    1px solid #EEF2F5;

  border-radius: 12px;

  padding: 16px 18px;

  box-shadow:
    0 1px 2px
    rgba(0, 0, 0, 0.03);
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
}

/* =========================================================
   FILTERS
========================================================= */

.filters {
  display: flex;

  justify-content: space-between;

  align-items: center;

  min-height: 55px;

  background: #FFFFFF;

  border:
    1px solid #EEF1F4;

  border-radius: 10px;

  padding: 8px 12px;

  flex-wrap: wrap;

  gap: 12px;

  width: 100%;

  box-sizing: border-box;
}

.filters-left {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-wrap: wrap;
}

.filter-pill {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  height: 30px;

  padding: 0 12px;

  background: #F8FAFC;

  border:
    1px solid #EEF1F4;

  border-radius: 7px;

  font-size: 12px;

  color: #334155;
}

.filter-label {
  font-weight: 600;

  color: #00313C;
}

.filter-select {
  border: none;

  background: transparent;

  outline: none;

  font-size: 12px;

  color: #64748B;

  font-family: inherit;

  cursor: pointer;
}

.filter-arrow {
  font-size: 10px;

  color: #94A3B8;
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
}

/* =========================================================
   VIEW SWITCH
========================================================= */

.view-switch {
  display: flex;

  align-items: center;

  height: 34px;

  background: #FFFFFF;

  border:
    1px solid #EEF1F4;

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

  font-family: inherit;
}

.view-option.active {
  background: #F8FAFC;

  color: #00313C;

  font-weight: 600;
}

/* =========================================================
   TABLE
========================================================= */

.table-card {
  width: 100%;

  max-width: 100%;

  background: #FFFFFF;

  border:
    1px solid #EEF2F5;

  border-radius: 15px;

  overflow: hidden;

  flex-shrink: 0;
}

.table-wrapper {
  width: 100%;

  max-width: 100%;

  overflow-x: auto;
}

.table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #CBD5E1;

  border-radius: 10px;
}

.user-table {
  width: 100%;

  min-width: 800px;

  border-collapse: collapse;

  font-size: 13px;
}

.user-table thead {
  background: #F8FAFC;
}

.user-table th {
  text-align: left;

  padding: 14px 20px;

  font-size: 11px;

  font-weight: 700;

  color: #64748B;

  letter-spacing: 0.08em;

  text-transform: uppercase;

  border-bottom:
    1px solid #EEF2F5;

  white-space: nowrap;
}

.user-table td {
  padding: 14px 20px;

  border-bottom:
    1px solid #F1F5F9;

  vertical-align: middle;

  color: #334155;
}

.user-table tbody tr:last-child td {
  border-bottom: none;
}

.user-table tbody tr:hover {
  background: #FAFBFC;
}

/* =========================================================
   MEMBER
========================================================= */

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

/* =========================================================
   BADGES
========================================================= */

.badge {
  display: inline-flex;

  align-items: center;

  padding: 3px 8px;

  border-radius: 6px;

  font-size: 9px;

  white-space: nowrap;
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
}

/* =========================================================
   ACTIONS
========================================================= */

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

  border:
    1px solid #EEF2F5;

  background: #FFFFFF;

  color: #475569;

  font-size: 14px;

  cursor: pointer;
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

/* =========================================================
   LOADING / EMPTY
========================================================= */

.loading-container,
.empty-container {
  min-height: 250px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}

.loading-container p,
.empty-container p {
  margin-top: 10px;

  margin-bottom: 0;

  font-size: 13px;

  color: #64748B;
}

.empty-container i {
  font-size: 36px;

  color: #E2E8F0;
}

/* =========================================================
   PAGINATION
========================================================= */

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

  border:
    1px solid #EEF2F5;

  background: #FFFFFF;

  color: #334155;

  font-size: 13px;

  cursor: pointer;
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

/* =========================================================
   BOTTOM CARDS
========================================================= */

.bottom-cards {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 16px;

  width: 100%;

  padding-bottom: 32px;
}

.bottom-card {
  border-radius: 16px;

  padding: 24px;

  position: relative;

  overflow: hidden;

  min-height: 180px;

  box-sizing: border-box;
}

.bottom-card.primary {
  background: #00313C;

  color: #FFFFFF;
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

  background:
    rgba(255,255,255,0.12);

  color: #FFFFFF;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 18px;
}

.bottom-title {
  font-size: 13px;

  font-weight: 600;

  margin: 0;
}

.bottom-desc {
  font-size: 11px;

  color:
    rgba(255,255,255,0.72);

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

  font-family: inherit;
}

.bottom-bg {
  position: absolute;

  right: 20px;

  bottom: 20px;

  font-size: 90px;

  opacity: 0.08;

  color: #FFFFFF;
}

.bottom-card.secondary {
  background: #FFFFFF;

  border:
    2px dashed #FECDD3;

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

  font-family: inherit;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1200px) {

  .stats {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
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

  .page-header {
    flex-direction: column;

    align-items: flex-start;
  }

  .filters {
    height: auto;
  }

}

@media (max-width: 768px) {

  .main {
    width: 100%;

    max-width: 100%;
  }

  .header {
    height: auto;

    min-height: 72px;

    padding: 12px 16px;

    flex-direction: column;

    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }

  .header-actions {
    justify-content: flex-end;
  }

  .content {
    padding: 20px 16px;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;

    align-items: stretch;
  }

  .filters-left {
    width: 100%;
  }

  .pagination {
    flex-direction: column;

    align-items: flex-start;

    gap: 12px;
  }

  .bottom-cards {
    grid-template-columns: 1fr;
  }

}
</style>