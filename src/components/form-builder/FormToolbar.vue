<template>
  <div class="form-toolbar">
    <div class="toolbar-card">
      <button class="toolbar-btn" @click="$emit('add-question')" title="Ajouter une question">
        <i class="bi bi-plus-lg"></i>
      </button>
      <button class="toolbar-btn" title="Dupliquer / Importer">
        <i class="bi bi-file-earmark-arrow-up"></i>
      </button>
      <button class="toolbar-btn" @click="$emit('add-title')" title="Ajouter un titre ou une description">
        <i class="bi bi-fonts"></i>
      </button>
      <button class="toolbar-btn" title="Ajouter une image">
        <i class="bi bi-image"></i>
      </button>
      <button class="toolbar-btn" title="Ajouter une vidéo">
        <i class="bi bi-play-circle"></i>
      </button>
      <button class="toolbar-btn" @click="$emit('add-section')" title="Ajouter une section">
        <i class="bi bi-layout-split"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['add-question', 'add-title', 'add-section'])
</script>

<style scoped>
.form-toolbar {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 90;
}

.toolbar-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #5f6368;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background: #f1f3f4;
  color: #202124;
}

.toolbar-text-btn {
  font-size: 12px;
  font-weight: 700;
  color: #5f6368;
}

@media (max-width: 1200px) {
  .form-toolbar {
    display: none;
  }
}
</style>
