<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useEntretiensStore } from '@/stores/entretiens'
import { useAuthStore } from '@/stores/auth'
import EntretienDetailModal from '@/components/entretiens/EntretienDetailModal.vue'
import DeleteEntretienModal from '@/components/entretiens/DeleteEntretienModal.vue'
import AIGeneratorModal from '@/components/entretiens/AIGeneratorModal.vue'
import IntegrationsModal from '@/components/entretiens/IntegrationsModal.vue'

const router = useRouter()
const store = useEntretiensStore()
const authStore = useAuthStore()

// États des modales
const showDetailModal = ref(false)
const selectedEntretien = ref(null)

const showDeleteModal = ref(false)
const entretienToDelete = ref(null)
const isDeleting = ref(false)

const showAIModal = ref(false)
const showIntegrationsModal = ref(false)

// Toast de notification
const toastMessage = ref('')
const showToast = ref(false)

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3500)
}

// Actions
const openDetail = (item) => {
  selectedEntretien.value = item
  showDetailModal.value = true
}

const openDelete = (item) => {
  entretienToDelete.value = item
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (!entretienToDelete.value) return
  isDeleting.value = true
  setTimeout(() => {
    store.deleteEntretien(entretienToDelete.value.id)
    isDeleting.value = false
    showDeleteModal.value = false
    triggerToast(`L'entretien « ${entretienToDelete.value.program} » a été supprimé.`)
    entretienToDelete.value = null
  }, 400)
}

const navigateToPlanifier = () => {
  router.push('/entretiens/planifier')
}

const handleEdit = (item) => {
  showDetailModal.value = false
  router.push('/entretiens/planifier')
}

const handleUseAIQuestions = () => {
  router.push('/entretiens/planifier')
}
</script>

<template>
  <div class="layout">
    <!-- Sidebar Navigation -->
    <Sidebar active-view="entretien" />

    <!-- Main Content Area -->
    <main class="main">
      <!-- Topbar Header -->
      <header class="topbar">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input
            type="text"
            v-model="store.searchQuery"
            placeholder="Search sessions, programs, or dates..."
          />
          <button
            v-if="store.searchQuery"
            class="btn-clear-search"
            @click="store.searchQuery = ''"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="header-actions">
          <button class="icon-btn notification-btn" title="Notifications">
            <i class="bi bi-bell"></i>
            <span class="notification-dot"></span>
          </button>

          <div class="user-pill">
            <div class="avatar">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Ndeye"
              />
            </div>
            <div class="user-meta">
              <span class="user-name">Ndeye</span>
              <span class="user-role">Recruitment Supervisor</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Page Content -->
      <div class="content">
        <!-- Toast Notification -->
        <transition name="toast">
          <div v-if="showToast" class="custom-toast">
            <i class="bi bi-check-circle-fill"></i>
            <span>{{ toastMessage }}</span>
          </div>
        </transition>

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Entretien Candidat</h1>
            <p class="page-subtitle">
              Coordonner les prochaines sessions d'évaluation et les évaluations des candidats.
            </p>
          </div>
          <button class="btn-planifier" @click="navigateToPlanifier">
            <i class="bi bi-calendar-plus"></i>
            <span>Planifier un entretien</span>
          </button>
        </div>

        <!-- 4 KPI Cards -->
        <div class="kpi-grid">
          <!-- Card 1 -->
          <div class="kpi-card">
            <div class="kpi-top">
              <div class="kpi-icon icon-blue">
                <i class="bi bi-calendar3"></i>
              </div>
              <span class="kpi-badge badge-green">{{ store.kpis.upcomingTrend }}</span>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">À VENIR CETTE SEMAINE</span>
              <span class="kpi-value">{{ store.kpis.upcomingWeek }} Entretiens Planifiés</span>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="kpi-card">
            <div class="kpi-top">
              <div class="kpi-icon icon-pink">
                <i class="bi bi-people"></i>
              </div>
              <span class="kpi-badge badge-gray">{{ store.kpis.totalTrend }}</span>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">TOTAL CANDIDATS POUR DEV WEB/IA</span>
              <span class="kpi-value">{{ store.kpis.totalDevWebIa }} personnes</span>
            </div>
          </div>


          <!-- Card 3 -->
          <div class="kpi-card">
            <div class="kpi-top">
              <div class="kpi-icon icon-green">
                <i class="bi bi-check2-circle"></i>
              </div>
              <span class="kpi-badge badge-green">{{ store.kpis.completionTrend }}</span>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">TAUX DES ENTRETIEN EFFECTUÉ</span>
              <span class="kpi-value">{{ store.kpis.completionRate }}%</span>
            </div>
          </div>
        </div>

        <!-- Filters and View Switcher Bar -->
        <div class="filters-bar">
          <div class="filters-left">
            <!-- Filter 1: Programme de formation -->
            <div class="filter-group">
              <span class="filter-title">PROGRAMME DE FORMATION</span>
              <div class="filter-select-wrapper">
                <select
                  v-model="store.filterProgram"
                  class="filter-select"
                  @change="store.setFilterProgram($event.target.value)"
                >
                  <option value="">Tous</option>
                  <option value="Developpement Web">Developpement Web</option>
                  <option value="Assistance digital">Assistance digital</option>
                  <option value="Designer UX/UI">Designer UX/UI créatif</option>
                  <option value="Analyste">Analyste en stratégie commerciale</option>
                </select>
                <i class="bi bi-chevron-down select-arrow"></i>
              </div>
            </div>

            <!-- Filter 2: Jour planifié -->
            <div class="filter-group">
              <span class="filter-title">JOUR PLANIFIÉ</span>
              <div class="filter-select-wrapper">
                <select
                  v-model="store.filterDay"
                  class="filter-select"
                  @change="store.setFilterDay($event.target.value)"
                >
                  <option value="">Semaine</option>
                  <option value="Lundi">Lundi</option>
                  <option value="Mardi">Mardi</option>
                  <option value="Mercredi">Mercredi</option>
                  <option value="Jeudi">Jeudi</option>
                  <option value="Vendredi">Vendredi</option>
                  <option value="Tous">Tous</option>
                </select>
                <i class="bi bi-chevron-down select-arrow"></i>
              </div>
            </div>

            <!-- Filter 3: Créneau horaire -->
            <div class="filter-group">
              <span class="filter-title">CRÉNEAU HORAIRE</span>
              <div class="filter-select-wrapper">
                <select
                  v-model="store.filterTimeSlot"
                  class="filter-select"
                  @change="store.setFilterTimeSlot($event.target.value)"
                >
                  <option value="">Heure</option>
                  <option value="Matin">Matin (08:00 - 12:00)</option>
                  <option value="Apres-midi">Après-midi (13:00 - 18:00)</option>
                  <option value="Tous">Tous</option>
                </select>
                <i class="bi bi-chevron-down select-arrow"></i>
              </div>
            </div>

            <!-- Quick link: Filtres récents -->
            <button class="btn-recent-filters" @click="store.resetFilters">
              Filtres récents
            </button>
          </div>

          <!-- View Switcher -->
          <div class="view-switcher">
            <button
              class="view-btn"
              :class="{ active: store.viewMode === 'grid' }"
              title="Vue en grille"
              @click="store.setViewMode('grid')"
            >
              <i class="bi bi-grid"></i>
            </button>
            <button
              class="view-btn"
              :class="{ active: store.viewMode === 'list' }"
              title="Vue en liste"
              @click="store.setViewMode('list')"
            >
              <i class="bi bi-list-ul"></i>
            </button>
          </div>
        </div>

        <!-- Main Data View (List View) -->
        <div v-if="store.viewMode === 'list'" class="table-container">
          <table class="custom-table">
            <thead>
              <tr>
                <th>PROGRAMME ENTRETIEN</th>
                <th>DUREE</th>
                <th>JOUR</th>
                <th>TYPE</th>
                <th class="text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="store.filteredEntretiens.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                  Aucun entretien ne correspond à vos critères de recherche.
                </td>
              </tr>
              <tr v-for="item in store.paginatedEntretiens" :key="item.id">
                <!-- Program Info -->
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div
                      class="program-badge-icon"
                      :style="{ backgroundColor: item.iconBg, color: item.iconColor }"
                    >
                      <i :class="['bi', `bi-${item.icon}`]"></i>
                    </div>
                    <div class="program-text">
                      <span class="program-name">{{ item.program }}</span>
                      <span class="program-dept">{{ item.department }}</span>
                    </div>
                  </div>
                </td>

                <!-- Window / Duration -->
                <td>
                  <div class="cell-stacked">
                    <span class="cell-main-text">{{ item.windowLabel }}</span>
                    <span class="cell-sub-text">{{ item.windowSub }}</span>
                  </div>
                </td>

                <!-- Planifier (Day & Time) -->
                <td>
                  <div class="cell-stacked">
                    <span class="cell-main-text text-capitalize">{{ item.day }}</span>
                    <span class="cell-time-text">{{ item.time }}</span>
                  </div>
                </td>

                <!-- Type Pill -->
                <td>
                  <span
                    class="type-badge"
                    :class="item.type === 'TECHNIQUE' ? 'type-badge-tech' : 'type-badge-moti'"
                  >
                    {{ item.type }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="text-end">
                  <div class="actions-wrapper">
                    <button class="btn-action-details" @click="openDetail(item)">
                      Details
                    </button>
                    <button
                      class="btn-action-icon"
                      title="Modifier"
                      @click="navigateToPlanifier"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn-action-icon btn-delete"
                      title="Supprimer"
                      @click="openDelete(item)"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Grid View Mode -->
        <div v-else class="grid-container">
          <div v-if="store.filteredEntretiens.length === 0" class="empty-state">
            <i class="bi bi-inbox fs-1 text-muted mb-2"></i>
            <p>Aucun entretien ne correspond à vos filtres.</p>
          </div>
          <div
            v-for="item in store.paginatedEntretiens"
            :key="item.id"
            class="interview-card"
          >
            <div class="card-top">
              <div class="d-flex align-items-center gap-3">
                <div
                  class="program-badge-icon"
                  :style="{ backgroundColor: item.iconBg, color: item.iconColor }"
                >
                  <i :class="['bi', `bi-${item.icon}`]"></i>
                </div>
                <div>
                  <h4 class="card-program-title">{{ item.program }}</h4>
                  <span class="card-dept-subtitle">{{ item.department }}</span>
                </div>
              </div>
              <span
                class="type-badge"
                :class="item.type === 'TECHNIQUE' ? 'type-badge-tech' : 'type-badge-moti'"
              >
                {{ item.type }}
              </span>
            </div>

            <div class="card-meta-grid">
              <div class="meta-item">
                <i class="bi bi-calendar3"></i>
                <div>
                  <div class="meta-val">{{ item.windowLabel }}</div>
                  <div class="meta-sub">{{ item.windowSub }}</div>
                </div>
              </div>
              <div class="meta-item">
                <i class="bi bi-clock"></i>
                <div>
                  <div class="meta-val">{{ item.day }}</div>
                  <div class="meta-sub text-danger fw-bold">{{ item.time }}</div>
                </div>
              </div>
            </div>

            <div class="card-candidates-row">
              <span class="candidates-label">Candidats :</span>
              <div class="avatar-stack">
                <img
                  v-for="(cand, idx) in item.candidates"
                  :key="idx"
                  :src="cand.avatar"
                  :alt="cand.name"
                  :title="cand.name"
                  class="stack-avatar"
                />
                <div v-if="item.extraCandidatesCount > 0" class="stack-extra-pill">
                  +{{ item.extraCandidatesCount }}
                </div>
              </div>
            </div>

            <div class="card-actions-footer">
              <button class="btn-card-details" @click="openDetail(item)">
                Voir les Détails
              </button>
              <div class="d-flex gap-2">
                <button
                  class="btn-action-icon"
                  title="Modifier"
                  @click="navigateToPlanifier"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn-action-icon btn-delete"
                  title="Supprimer"
                  @click="openDelete(item)"
                >
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Row -->
        <div class="pagination-row">
          <div class="pagination-info">
            Affichage de 1 à {{ store.paginatedEntretiens.length }} sur
            {{ store.filteredEntretiens.length }} entretiens en cours
          </div>
          <div class="pagination-controls">
            <button
              class="page-nav-btn"
              :disabled="store.currentPage === 1"
              @click="store.setPage(store.currentPage - 1)"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            <button
              v-for="page in store.totalPages"
              :key="page"
              class="page-num-btn"
              :class="{ active: store.currentPage === page }"
              @click="store.setPage(page)"
            >
              {{ page }}
            </button>
            <button
              class="page-nav-btn"
              :disabled="store.currentPage === store.totalPages"
              @click="store.setPage(store.currentPage + 1)"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Two Bottom Feature Cards -->
        <div class="bottom-features-grid">
          <!-- Card 1: Générateur d'entretiens IA (Dark Slate Card) -->
          <div class="ai-feature-card">
            <div class="ai-card-watermark">
              <i class="bi bi-cpu"></i>
            </div>
            <div class="ai-card-content">
              <div class="ai-card-icon-badge">
                <i class="bi bi-robot"></i>
              </div>
              <h3 class="ai-card-title">Générateur d'entretiens IA</h3>
              <p class="ai-card-desc">
                Générez automatiquement des questions techniques et grilles d'évaluation en
                fonction des exigences du poste et du niveau du candidat.
              </p>
              <button class="btn-ai-action" @click="showAIModal = true">
                Essayer le générateur IA
              </button>
            </div>
          </div>

          <!-- Card 2: Intégration des réunions (White Card) -->
          <div class="meetings-feature-card">
            <div class="d-flex align-items-start gap-3">
              <div class="meetings-icon-badge">
                <i class="bi bi-camera-video-fill"></i>
              </div>
              <div class="meetings-text-content">
                <h3 class="meetings-card-title">Intégration des réunions</h3>
                <p class="meetings-card-desc">
                  Sync your calendar with Zoom, Teams, eSynchronisez votre calendrier avec Zoom,
                  Teams ou Google Meet en toute simplicité / Google Meet seamlessly.
                </p>
              </div>
            </div>
            <div class="meetings-card-action">
              <button class="btn-meetings-action" @click="showIntegrationsModal = true">
                Connecter les applications.
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <EntretienDetailModal
      v-if="selectedEntretien"
      :show="showDetailModal"
      :entretien="selectedEntretien"
      @close="showDetailModal = false"
      @edit="handleEdit"
    />

    <DeleteEntretienModal
      v-if="entretienToDelete"
      :show="showDeleteModal"
      :entretien="entretienToDelete"
      :is-deleting="isDeleting"
      @cancel="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <AIGeneratorModal
      :show="showAIModal"
      @close="showAIModal = false"
      @use-questions="handleUseAIQuestions"
    />

    <IntegrationsModal
      :show="showIntegrationsModal"
      @close="showIntegrationsModal = false"
    />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  background: #F8FAFC;
}

.main {
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #FAFAFA;
  overflow-x: hidden;
}

/* ============================================================
   TOPBAR
============================================================ */
.topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 2rem;
  background: #FFFFFF;
  border-bottom: 1px solid #EEF2F6;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 420px;
  padding: 8px 16px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: #00313C;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(0, 49, 60, 0.08);
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
}

.btn-clear-search {
  background: transparent;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.notification-btn {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  color: #64748B;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.notification-btn:hover {
  background: #F8FAFC;
  color: #0F172A;
}

.notification-dot {
  position: absolute;
  top: 9px;
  right: 10px;
  width: 7px;
  height: 7px;
  background: #D20C4F;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-pill .avatar img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: #94A3B8;
}

/* ============================================================
   PAGE CONTENT
============================================================ */
.content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.custom-toast {
  position: fixed;
  top: 80px;
  right: 2rem;
  z-index: 100;
  background: #00313C;
  color: #FFFFFF;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  font-size: 0.875rem;
  font-weight: 600;
}

.custom-toast i {
  color: #10B981;
  font-size: 1.1rem;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.page-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #00313C;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
}

.btn-planifier {
  background: #D20C4F;
  color: #FFFFFF;
  border: none;
  padding: 0.7rem 1.35rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(210, 12, 79, 0.25);
}

.btn-planifier:hover {
  background: #B50942;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(210, 12, 79, 0.35);
}

/* ============================================================
   KPI CARDS GRID (4 cards)
============================================================ */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.kpi-card {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 1.25rem;
  border: 1px solid #EEF2F6;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05);
}

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.icon-blue {
  background: #EFF6FF;
  color: #3B82F6;
}

.icon-pink {
  background: #FDF2F8;
  color: #EC4899;
}

.icon-orange {
  background: #FEF3C7;
  color: #D97706;
}

.icon-green {
  background: #ECFDF5;
  color: #10B981;
}

.kpi-badge {
  font-size: 0.725rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 20px;
}

.badge-green {
  background: #DCFCE7;
  color: #16A34A;
}

.badge-gray {
  background: #F1F5F9;
  color: #64748B;
}

.badge-red {
  background: #FEE2E2;
  color: #DC2626;
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kpi-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #94A3B8;
  text-transform: uppercase;
}

.kpi-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.01em;
}

/* ============================================================
   FILTERS & CONTROLS BAR
============================================================ */
.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  padding: 0.85rem 1.25rem;
  border-radius: 14px;
  border: 1px solid #EEF2F6;
}

.filters-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-title {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #94A3B8;
  text-transform: uppercase;
}

.filter-select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.filter-select {
  appearance: none;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 0.45rem 2rem 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.825rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
}

.filter-select:hover,
.filter-select:focus {
  border-color: #00313C;
}

.select-arrow {
  position: absolute;
  right: 0.7rem;
  font-size: 0.7rem;
  color: #94A3B8;
  pointer-events: none;
}

.btn-recent-filters {
  background: transparent;
  border: none;
  color: #D20C4F;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.45rem 0.5rem;
  margin-top: 1rem;
  transition: color 0.15s;
}

.btn-recent-filters:hover {
  text-decoration: underline;
}

.view-switcher {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: #F1F5F9;
  padding: 0.25rem;
  border-radius: 10px;
}

.view-btn {
  background: transparent;
  border: none;
  color: #64748B;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s;
}

.view-btn.active {
  background: #00313C;
  color: #FFFFFF;
}

/* ============================================================
   TABLE (LIST VIEW)
============================================================ */
.table-container {
  background: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #EEF2F6;
  overflow: hidden;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.custom-table thead {
  background: #FAFAFA;
  border-bottom: 1px solid #EEF2F6;
}

.custom-table th {
  padding: 1rem 1.25rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #94A3B8;
  text-transform: uppercase;
}

.custom-table td {
  padding: 1.15rem 1.25rem;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
}

.custom-table tbody tr:hover {
  background-color: #F8FAFC;
}

.program-badge-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  font-weight: 700;
}

.program-text {
  display: flex;
  flex-direction: column;
}

.program-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0F172A;
}

.program-dept {
  font-size: 0.675rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #94A3B8;
  text-transform: uppercase;
}

.cell-stacked {
  display: flex;
  flex-direction: column;
}

.cell-main-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1E293B;
}

.cell-sub-text {
  font-size: 0.725rem;
  color: #94A3B8;
}

.cell-time-text {
  font-size: 0.725rem;
  font-weight: 600;
  color: #D20C4F;
}

/* Avatar Stack */
.avatar-stack {
  display: flex;
  align-items: center;
}

.stack-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
  object-fit: cover;
  margin-left: -8px;
  transition: transform 0.15s;
}

.stack-avatar:first-child {
  margin-left: 0;
}

.stack-avatar:hover {
  transform: translateY(-2px) scale(1.1);
  z-index: 2;
}

.stack-extra-pill {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #F1F5F9;
  border: 2px solid #FFFFFF;
  color: #475569;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -6px;
}

/* Type Pill */
.type-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.type-badge-tech {
  background: #00313C;
  color: #FFFFFF;
}

.type-badge-moti {
  background: #F1F5F9;
  color: #475569;
}

/* Actions */
.actions-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-action-details {
  background: transparent;
  border: none;
  color: #475569;
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  transition: all 0.15s;
}

.btn-action-details:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.btn-action-icon {
  background: transparent;
  border: none;
  color: #64748B;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-action-icon:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.btn-delete {
  color: #EF4444;
}

.btn-delete:hover {
  background: #FEE2E2;
  color: #DC2626;
}

/* ============================================================
   GRID VIEW
============================================================ */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.interview-card {
  background: #FFFFFF;
  border: 1px solid #EEF2F6;
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-program-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.card-dept-subtitle {
  font-size: 0.675rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
}

.card-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  background: #F8FAFC;
  padding: 0.75rem;
  border-radius: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item i {
  color: #64748B;
  font-size: 1rem;
}

.meta-val {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1E293B;
}

.meta-sub {
  font-size: 0.7rem;
  color: #64748B;
}

.card-candidates-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.candidates-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748B;
}

.card-actions-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #F1F5F9;
  padding-top: 0.75rem;
}

.btn-card-details {
  background: #F1F5F9;
  border: none;
  color: #334155;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-card-details:hover {
  background: #E2E8F0;
}

/* ============================================================
   PAGINATION ROW
============================================================ */
.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.pagination-info {
  font-size: 0.825rem;
  color: #64748B;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.page-nav-btn {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.15s;
}

.page-nav-btn:hover:not(:disabled) {
  background: #F8FAFC;
  color: #0F172A;
}

.page-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-num-btn {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.page-num-btn:hover {
  border-color: #CBD5E1;
}

.page-num-btn.active {
  background: #00313C;
  border-color: #00313C;
  color: #FFFFFF;
}

/* ============================================================
   TWO BOTTOM FEATURE CARDS
============================================================ */
.bottom-features-grid {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

/* AI Feature Card */
.ai-feature-card {
  position: relative;
  background: #00313C;
  border-radius: 16px;
  padding: 1.75rem;
  overflow: hidden;
  color: #FFFFFF;
  box-shadow: 0 10px 25px -5px rgba(0, 49, 60, 0.25);
}

.ai-card-watermark {
  position: absolute;
  right: -20px;
  bottom: -20px;
  font-size: 10rem;
  color: rgba(255, 255, 255, 0.03);
  pointer-events: none;
}

.ai-card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ai-card-icon-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #38BDF8;
}

.ai-card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.ai-card-desc {
  font-size: 0.8rem;
  color: #94A3B8;
  line-height: 1.45;
  margin: 0;
}

.btn-ai-action {
  align-self: flex-start;
  background: #D20C4F;
  color: #FFFFFF;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.15s;
}

.btn-ai-action:hover {
  background: #B50942;
  transform: translateY(-1px);
}

/* Meetings Feature Card */
.meetings-feature-card {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #EEF2F6;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.meetings-icon-badge {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #FDF2F8;
  color: #D20C4F;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}

.meetings-text-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.meetings-card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
}

.meetings-card-desc {
  font-size: 0.8rem;
  color: #64748B;
  line-height: 1.45;
  margin: 0;
}

.btn-meetings-action {
  background: #FFFFFF;
  color: #0F172A;
  border: 1.5px solid #00313C;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.btn-meetings-action:hover {
  background: #00313C;
  color: #FFFFFF;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .bottom-features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .topbar {
    padding: 0 1rem;
  }
  .search-box {
    width: 200px;
  }
  .content {
    padding: 1rem;
  }
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .meetings-feature-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
