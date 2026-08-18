<template>
  <div class="container-fluid d-flex align-items-center justify-content-center" style="background-color: #F8F9FA; padding: 0; font-family: 'Inter', Arial, sans-serif; height: 100vh;">

    <div class="row g-0 bg-white shadow overflow-hidden w-100 h-100">

      <!-- PARTIE GAUCHE -->
      <div class="col-md-6 d-flex flex-column justify-content-between" style="background-color: #00313C; padding: 48px 40px;">

        <!-- Logo -->
        <div>
          <img
            src="@/assets/logo.png"
            alt="Sourcing HUB"
            class="img-fluid"
            style="width: 500px; height: auto;"
          >
        </div>

        <!-- Texte bas -->
        <div>
          <h4 class="fw-semibold text-white mb-3" style="font-size: 18px; line-height: 1.3; max-width: 450px;">
            Définissez votre nouveau mot de passe.
          </h4>
          <p class="text-white-50 mb-0" style="font-size: 12px; line-height: 1.5; max-width: 300px;">
            Choisissez un mot de passe sécurisé pour protéger l'accès à votre compte.
          </p>
        </div>

      </div>

      <!-- PARTIE DROITE -->
      <div class="col-md-6 d-flex flex-column justify-content-center" style="padding: 48px 48px 40px 48px; background-color: #FFFFFF;">

        <div class="w-100" style="max-width: 460px; margin: 0 auto;">

          <!-- Header -->
          <div class="mb-4">
            <h2 class="fw-bold mb-2" style="font-size: 28px; color: #111827; line-height: 1.2;">
              Nouveau mot de passe
            </h2>
            <p class="text-secondary mb-0" style="font-size: 14px;">
              Saisissez et confirmez votre nouveau mot de passe.
            </p>
          </div>

          <!-- Alertes Feedback -->
          <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center py-2 px-3 mb-4" style="font-size: 13px; border-radius: 8px;">
            <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <div>{{ errorMessage }}</div>
          </div>

          <div v-if="successMessage" class="alert alert-success d-flex align-items-center py-2 px-3 mb-4" style="font-size: 13px; border-radius: 8px;">
            <i class="bi bi-check-circle-fill me-2 fs-5"></i>
            <div>{{ successMessage }}</div>
          </div>

          <!-- Formulaire -->
          <form v-if="!successMessage" @submit.prevent="handleSubmit" class="w-100">

            <!-- Nouveau mot de passe -->
            <div class="mb-4">
              <label for="new_password" class="form-label fw-medium" style="font-size: 14px; color: #1F2937; margin-bottom: 8px;">
                Nouveau mot de passe
              </label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0" style="border: 1px solid #E5E7EB; border-right: none; padding: 0 16px;">
                  <i class="bi bi-lock" style="font-size: 18px; color: #9CA3AF;"></i>
                </span>
                <input
                  id="new_password"
                  v-model="form.newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control border-start-0"
                  style="height: 48px; font-size: 14px; border: 1px solid #E5E7EB; border-left: none;"
                  placeholder="••••••••"
                  required
                >
                <button
                  type="button"
                  class="input-group-text bg-white border-start-0"
                  style="border: 1px solid #E5E7EB; border-left: none; cursor: pointer; padding: 0 16px;"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" style="font-size: 18px; color: #9CA3AF;"></i>
                </button>
              </div>
            </div>

            <!-- Confirmation nouveau mot de passe -->
            <div class="mb-4">
              <label for="new_password_confirm" class="form-label fw-medium" style="font-size: 14px; color: #1F2937; margin-bottom: 8px;">
                Confirmer le mot de passe
              </label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0" style="border: 1px solid #E5E7EB; border-right: none; padding: 0 16px;">
                  <i class="bi bi-lock-fill" style="font-size: 18px; color: #9CA3AF;"></i>
                </span>
                <input
                  id="new_password_confirm"
                  v-model="form.newPasswordConfirm"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control border-start-0"
                  style="height: 48px; font-size: 14px; border: 1px solid #E5E7EB; border-left: none;"
                  placeholder="••••••••"
                  required
                >
                <button
                  type="button"
                  class="input-group-text bg-white border-start-0"
                  style="border: 1px solid #E5E7EB; border-left: none; cursor: pointer; padding: 0 16px;"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" style="font-size: 18px; color: #9CA3AF;"></i>
                </button>
              </div>
            </div>

            <!-- Bouton de soumission -->
            <button
              type="submit"
              class="btn w-100 fw-semibold text-white mb-0"
              style="background-color: #D20C4F; border: none; height: 48px; font-size: 16px; border-radius: 6px; transition: background-color 0.2s;"
              :disabled="loading"
              @mouseenter="hoverBtn = true"
              @mouseleave="hoverBtn = false"
              :style="hoverBtn && !loading ? 'background-color: #b01a3f;' : 'background-color: #D20C4F;'"
            >
              <span v-if="loading">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Réinitialisation...
              </span>
              <span v-else>Valider le mot de passe</span>
            </button>

          </form>

          <!-- Bouton retour connexion si succès -->
          <div v-else class="text-center mt-3">
            <router-link
              to="/login"
              class="btn w-100 fw-semibold text-white"
              style="background-color: #00313C; height: 48px; font-size: 15px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none;"
            >
              Se connecter
            </router-link>
          </div>

          <div class="text-center mt-4">
            <router-link to="/login" style="font-size: 13px; color: #D20C4F; text-decoration: none; font-weight: 500;">
              ← Retour à la connexion
            </router-link>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  newPassword: '',
  newPasswordConfirm: ''
})

const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const hoverBtn = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const uid = ref('')
const token = ref('')

onMounted(() => {
  uid.value = route.params.uid || route.query.uid || ''
  token.value = route.params.token || route.query.token || ''

  if (!uid.value || !token.value) {
    errorMessage.value = "Lien de réinitialisation invalide ou incomplet."
  }
})

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!uid.value || !token.value) {
    errorMessage.value = "Le lien de réinitialisation est incomplet (UID ou token manquant)."
    return
  }

  if (form.newPassword !== form.newPasswordConfirm) {
    errorMessage.value = "Les deux mots de passe ne correspondent pas."
    return
  }

  if (form.newPassword.length < 8) {
    errorMessage.value = "Le mot de passe doit contenir au moins 8 caractères."
    return
  }

  loading.value = true
  try {
    const data = await authStore.confirmPasswordReset({
      uid: uid.value,
      token: token.value,
      new_password: form.newPassword,
      new_password_confirm: form.newPasswordConfirm
    })
    successMessage.value = data.detail || "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter."
    setTimeout(() => {
      router.push('/login')
    }, 2500)
  } catch (err) {
    errorMessage.value = authStore.error || "Erreur lors de la réinitialisation du mot de passe."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>
