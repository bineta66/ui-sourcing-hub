<script setup>
defineProps({
  breadcrumb: { type: String, required: true },
  userName: { type: String, default: 'Utilisateur' },
  userRole: { type: String, default: '' },
  avatar: { type: String, default: '' }
})
</script>

<template>
  <header class="topbar d-flex align-items-center justify-content-between px-4 py-3">
    <span class="breadcrumb-text">{{ breadcrumb }}</span>

    <div class="d-flex align-items-center gap-3">
      <button type="button" class="btn notif-btn">
        <i class="fa-regular fa-bell"></i>
      </button>

      <div class="vr"></div>

      <div class="d-flex align-items-center gap-2">
        <div class="d-flex flex-column text-end">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
        <img v-if="avatar" :src="avatar" alt="avatar" class="user-avatar" />
        <div v-else class="user-avatar-placeholder">{{ userName.charAt(0) }}</div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  background-color: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
  font-family: 'Nunito Sans', sans-serif;
}
.breadcrumb-text { color: #94A3B8; font-size: 14px; font-weight: 600; }
.notif-btn {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid #E2E8F0; background-color: #FFFFFF; color: #00313C;
  display: flex; align-items: center; justify-content: center; position: relative;
}
.notif-btn::after {
  content: ''; position: absolute; top: 8px; right: 9px;
  width: 6px; height: 6px; background-color: #D20C4F; border-radius: 50%;
}
.vr { width: 1px; height: 32px; background-color: #E2E8F0; }
.user-name { font-size: 14px; font-weight: 700; color: #00313C; }
.user-role { font-size: 11px; font-weight: 600; color: #94A3B8; text-transform: uppercase; }
.user-avatar, .user-avatar-placeholder {
  width: 42px; height: 42px; border-radius: 50%; object-fit: cover;
}
.user-avatar-placeholder {
  background-color: #D20C4F; color: #FFFFFF;
  display: flex; align-items: center; justify-content: center; font-weight: 700;
}
</style>