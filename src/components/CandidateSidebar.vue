<template>
  <aside class="candidate-sidebar d-flex flex-column justify-content-between p-4">
    <div>
      <div class="brand d-flex align-items-center gap-3 mb-5">
        <div class="brand-icon">
          <i class="fa-solid fa-user-group"></i>
        </div>
        <div class="brand-text">
          <span class="brand-sourcing">SOURCING</span>
          <span class="brand-hub">HUB</span>
        </div>
      </div>

     

      <nav class="nav-list d-flex flex-column gap-2">
        <router-link
          to="/candidate/entretiens"
          class="btn nav-btn w-100 d-flex align-items-center gap-3 px-3 py-2 text-start rounded-3"
          :class="{ 'active': activeView === 'candidature' }"
        >
          <i class="fa-regular fa-user nav-icon"></i>
          <span class="nav-label">Ma candidature</span>
        </router-link>
        <router-link
          to="/candidate/tests"
          class="btn nav-btn w-100 d-flex align-items-center gap-3 px-3 py-2 text-start rounded-3"
          :class="{ 'active': activeView === 'tests' }"
        >
          <i class="fa-regular fa-file-lines nav-icon"></i>
          <span class="nav-label">Mes tests</span>
        </router-link>
        <router-link
          to="/candidate/profil"
          class="btn nav-btn w-100 d-flex align-items-center gap-3 px-3 py-2 text-start rounded-3"
          :class="{ 'active': activeView === 'profil' }"
        >
          <i class="fa-regular fa-user nav-icon"></i>
          <span class="nav-label">Mon profil</span>
        </router-link>
      </nav>
    </div>

    <div class="logout-section pt-3 border-top border-secondary border-opacity-25">
      <button
        type="button"
        class="btn logout-btn w-100 d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-start text-white"
        @click="emit('logout')"
      >
        <i class="fa-solid fa-right-from-bracket"></i>
        <span class="fw-bold">Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  activeView: {
    type: String,
    required: true,
    default: 'candidature'
  }
})

const emit = defineEmits(['logout'])
</script>

<style scoped>
.candidate-sidebar {
  width: 256px;
  height: 100vh;
  background-color: #00313C;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
  overflow-y: auto;
  z-index: 30;
  font-family: 'Inter', 'Nunito Sans', sans-serif;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background-color: #D20C4F;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  flex-shrink: 0;
}

.brand-text {
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.brand-sourcing {
  color: #ffffff;
}

.brand-hub {
  color: #D20C4F;
}

.candidate-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.candidate-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.candidate-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.candidate-name {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.candidate-role {
  font-size: 12px;
  font-weight: 500;
  color: #94A3B8;
  line-height: 1.2;
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

@media (max-width: 991.98px) {
  .candidate-sidebar {
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

  .brand,
  .candidate-profile,
  .logout-section {
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
