<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({
  activeView: {
    type: String,
    required: true,
    default: 'Campagnes'
  }
})

const emit = defineEmits(['changeView', 'logout'])
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  emit('logout')
  await authStore.logout()
  router.push('/login')
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie', to: '/campagnes' },
  { id: 'presences-ri', label: 'Présences RI', icon: 'fa-solid fa-qrcode', to: '/admin/presences-ri' },
  { id: 'entretien', label: 'Entretien', icon: 'fa-regular fa-calendar-check', to: '/entretiens' },
  { id: 'entretiens-jury', label: 'Entretiens Jurés', icon: 'fa-regular fa-calendar-check', to: '/entretiensjury' },
  { id: 'campagnes', label: 'Campagnes', icon: 'fa-solid fa-file-lines', to: '/campagnes' },
  { id: 'utilisateurs', label: 'Utilisateurs', icon: 'fa-solid fa-users', to: '/gestion-utilisateurs' },
  { id: 'ai-analytics', label: 'AI Analytics', icon: 'fa-solid fa-brain', to: '/campagnes' },
  { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear', to: '/campagnes' },
]
</script>

<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.0/css/all.min.css" integrity="sha512-ApSLB1Pd3/bZN8fWB/RG9YhN/7bd9Hkf3AGaE2mPfebjrxagjuBtx2GcgdqIlJkUzwylBo61r9Xa9NmgBI0swA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <aside class="sidebar d-flex flex-column justify-content-between p-4">
    <!-- Section Supérieure : Logo + Menu -->
    <div>
      <!-- Logo / Brand Header -->
      <div class="brand d-flex align-items-center gap-3 ">
        <div class="d-flex flex-column">
          <img src="@/assets/logo.png" alt="Logo" class="img-fluid brand-title" />
        </div>
      </div>

      <!-- Liste des liens de navigation -->
      <nav class="nav-list d-flex flex-column gap-2">
        <div 
          v-for="item in navItems" 
          :key="item.id" 
          class="nav-item"
        >
          <router-link
            :to="item.to"
            class="btn nav-btn w-100 d-flex align-items-center gap-3 px-3 py-2 text-start rounded-3"
            :class="{ 'active': activeView === item.id }"
          >
            <i :class="[item.icon, 'nav-icon']"></i>
            <span class="nav-label">{{ item.label }}</span>
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Section Inférieure : Déconnexion -->
    <div class="logout-section pt-3 border-top border-secondary border-opacity-25">
      <button 
        type="button" 
        class="btn logout-btn w-100 d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-start text-white"
        @click="handleLogout"
      >
        <i class="fa-solid fa-right-from-bracket"></i>
        <span class="fw-bold">Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 256px;
  min-width: 256px;
  max-width: 256px;
  flex-shrink: 0;
  height: 100vh;
  background-color: #00313C;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
  overflow-y: auto;
  z-index: 30;
  font-family: 'Nunito Sans', sans-serif;
  box-sizing: border-box;
}

.brand-logo {
  width: 36px;
  height: 36px;
  background-color: #D20C4F;
  border-radius: 50%;
}

.brand-title {
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.brand-subtitle {
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.nav-btn {
  color: #94A3B8;
  font-size: 14px;
  font-weight: 600;
  border: none;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  color: #FFFFFF;
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-btn.active {
  background-color: #D20C4F;
  color: #FFFFFF;
  box-shadow: 0px 4px 6px -4px rgba(127, 29, 29, 0.20), 0px 10px 15px -3px rgba(127, 29, 29, 0.20);
}

.nav-icon {
  width: 20px;
  text-align: center;
  font-size: 16px;
}

.logout-btn {
  color: #FFFFFF;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
}

/* Version responsive mobile / tablette */
@media (max-width: 991.98px) {
  .sidebar {
    width: 100%;
    min-height: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    z-index: 1030;
    padding: 0.5rem 1rem !important;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
  }

  .brand, .logout-section {
    display: none !important;
  }

  .nav-list {
    flex-direction: row !important;
    justify-content: space-around;
    width: 100%;
    gap: 0 !important;
  }

  .nav-btn {
    flex-direction: column;
    gap: 4px !important;
    padding: 6px 8px !important;
    font-size: 10px;
    align-items: center !important;
  }

  .nav-icon {
    font-size: 18px;
  }
}
</style>