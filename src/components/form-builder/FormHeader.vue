<template>
  <header class="form-header">
    <div class="form-header-left">
      <div class="brand-logo">
        <span class="brand-text">Sourcing HUB</span>
      </div>
      <div class="form-title-input-wrapper">
        <input
          v-model="localTitle"
          class="form-title-input"
          placeholder="Formulaire sans titre"
        />
        <button class="star-btn" title="Ajouter aux favoris">
          <i class="bi bi-star"></i>
        </button>
      </div>
    </div>

    <div class="form-header-right">
      <button class="header-icon-btn" title="Personnaliser le thème">
        <i class="bi bi-palette"></i>
      </button>
      <button class="header-icon-btn header-eye-btn" title="Visualiser" @click="$emit('preview')">
        <i class="bi bi-eye"></i>
        <span class="eye-label">Visualiser</span>
      </button>
      <button class="header-icon-btn" title="Annuler">
        <i class="bi bi-arrow-counterclockwise"></i>
      </button>
      <button class="header-icon-btn" title="Rétablir">
        <i class="bi bi-arrow-clockwise"></i>
      </button>
      <button class="header-icon-btn" title="Copier le lien">
        <i class="bi bi-link-45deg"></i>
      </button>
      <button class="publish-btn" @click="$emit('publish')">
        Publier
      </button>
      <button class="header-icon-btn" title="Plus d'options">
        <i class="bi bi-three-dots-vertical"></i>
      </button>
      <div class="admin-avatar">
        <img
          src="https://ui-avatars.com/api/?name=Ndeye&background=D20C4F&color=fff&size=32"
          alt="Admin"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFormBuilderStore } from '@/stores/formBuilder'

const emit = defineEmits(['preview', 'publish'])
const store = useFormBuilderStore()
const localTitle = ref(store.formTitle)

watch(() => localTitle.value, (val) => {
  store.updateMeta({ title: val })
})
</script>

<style scoped>
.form-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.form-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.brand-text {
  font-size: 16px;
  font-weight: 800;
  color: #D20C4F;
  letter-spacing: -0.02em;
}

.form-title-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.form-title-input {
  border: 1px solid transparent;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  padding: 6px 10px;
  border-radius: 6px;
  flex: 1;
  min-width: 0;
  max-width: 400px;
}

.form-title-input:focus {
  outline: none;
  border-color: #0d6efd;
  background: #fff;
}

.form-title-input::placeholder {
  color: #adb5bd;
}

.star-btn {
  background: none;
  border: none;
  color: #adb5bd;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.15s;
  flex-shrink: 0;
}

.star-btn:hover {
  color: #f59e0b;
  background: #fef3c7;
}

.form-header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.header-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #5f6368;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.header-icon-btn:hover {
  background: #f1f3f4;
  color: #202124;
}

.header-eye-btn {
  width: auto;
  padding: 0 12px;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
}

.eye-label {
  font-size: 13px;
}

.publish-btn {
  height: 36px;
  padding: 0 20px;
  border-radius: 8px;
  border: none;
  background: #7c3aed;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.publish-btn:hover {
  background: #6d28d9;
}

.admin-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 8px;
  cursor: pointer;
  border: 2px solid #e9ecef;
}

.admin-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .form-header {
    padding: 0 16px;
    height: auto;
    min-height: 64px;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .form-title-input {
    max-width: none;
  }
  .eye-label {
    display: none;
  }
}
</style>
