<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <img
        src="@/assets/logo.png"
        alt="SOURCING HUB"
        class="logo-img"
      >
    </div>

    <nav class="sidebar-nav">
      <a href="#" class="nav-item d-flex align-items-center gap-2">
        <i class="bi bi-speedometer2"></i>
        <span>Dashboard</span>
      </a>
      <a href="#" class="nav-item d-flex align-items-center gap-2">
        <i class="bi bi-calendar-check"></i>
        <span>Entretien</span>
      </a>
      <a href="#" class="nav-item d-flex align-items-center gap-2">
        <i class="bi bi-megaphone"></i>
        <span>Campagnes</span>
      </a>
      <a href="#" class="nav-item d-flex align-items-center gap-2">
        <i class="bi bi-people"></i>
        <span>Candidates</span>
      </a>
      <a href="#" class="nav-item active d-flex align-items-center gap-2">
        <i class="bi bi-person-gear"></i>
        <span>Utilisateurs</span>
      </a>
      <a href="#" class="nav-item d-flex align-items-center gap-2">
        <i class="bi bi-cpu"></i>
        <span>AI Analytics</span>
      </a>
      <a href="#" class="nav-item d-flex align-items-center gap-2">
        <i class="bi bi-gear"></i>
        <span>Paramètre</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <a href="#" class="nav-item logout d-flex align-items-center gap-2">
        <i class="bi bi-box-arrow-right"></i>
        <span>Déconnexion</span>
      </a>
    </div>
  </aside>
</template>

<script setup>
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #00313C;
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}



.sidebar-logo {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 0 0 2px 0;
}

.logo-img {
  width: 140px;
  height: auto;
  max-height: 50px;
  object-fit: contain;
  display: block;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  width: 100%;
}

.nav-item {
  padding: 10px 12px;
  border-radius: 8px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.nav-item i {
  font-size: 18px;
}

.nav-item:hover {
  color: #FFFFFF;
  background: rgba(255,255,255,0.05);
}

.nav-item.active {
  background-color: #D20C4F;
  color: #FFFFFF;
}

.sidebar-footer {
  margin-top: auto;
  width: 100%;
}

.nav-item.logout {
  color: rgba(255,255,255,0.6);
}

.nav-item.logout:hover {
  color: #FFFFFF;
}
</style>