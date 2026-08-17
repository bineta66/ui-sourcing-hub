<template>
  <div v-if="modelValue" class="publish-overlay" @click.self="close">
    <div class="publish-modal">
      <div class="publish-modal-header">
        <div class="publish-modal-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <h3 class="publish-modal-title">Formulaire publié avec succès</h3>
        <button class="publish-modal-close" @click="close" title="Fermer">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="publish-modal-body">
        <p class="publish-modal-text">
          Votre formulaire de candidature est maintenant accessible via le lien ci-dessous.
        </p>

        <div class="publish-url-block">
          <label class="publish-url-label">Lien du formulaire</label>
          <div class="publish-url-row">
            <input
              ref="urlInput"
              type="text"
              class="publish-url-input"
              :value="publicUrl"
              readonly
            />
            <button class="publish-copy-btn" @click="copyUrl" title="Copier le lien">
              <i :class="copied ? 'bi bi-check-lg' : 'bi bi-clipboard'"></i>
              <span>{{ copied ? 'Lien copié !' : 'Copier le lien' }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="publish-modal-footer">
        <button class="btn btn-outline-secondary" @click="openForm" target="_blank">
          <i class="bi bi-box-arrow-up-right"></i> Ouvrir le formulaire
        </button>
        <button class="btn btn-primary" @click="close">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  slug: String
})

const emit = defineEmits(['update:modelValue'])

const copied = ref(false)
const urlInput = ref(null)

const publicUrl = computed(() => {
  const base = window.location.origin
  return `${base}/candidature/${props.slug}`
})

const close = () => {
  copied.value = false
  emit('update:modelValue', false)
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(publicUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    if (urlInput.value) {
      urlInput.value.select()
      document.execCommand('copy')
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  }
}

const openForm = () => {
  window.open(publicUrl.value, '_blank')
}
</script>

<style scoped>
.publish-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1060;
}

.publish-modal {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  font-family: 'Nunito Sans', sans-serif;
}

.publish-modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px 0;
}

.publish-modal-icon {
  color: #16a34a;
  font-size: 22px;
}

.publish-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #00313C;
  margin: 0;
  flex: 1;
}

.publish-modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.publish-modal-close:hover {
  background: #e5e7eb;
  color: #111827;
}

.publish-modal-body {
  padding: 20px 24px;
}

.publish-modal-text {
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 16px;
  line-height: 1.5;
}

.publish-url-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.publish-url-label {
  font-size: 12px;
  font-weight: 700;
  color: #00313C;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.publish-url-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.publish-url-input {
  flex: 1;
  min-width: 0;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13px;
  color: #111827;
  background: #f9fafb;
}

.publish-url-input:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  background: #ffffff;
}

.publish-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.publish-copy-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.publish-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 24px 20px;
}
</style>
