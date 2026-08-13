<template>
  <div class="container-fluid d-flex align-items-center justify-content-center" style="background-color: #F8F9FA; padding: 0; font-family: 'Inter', Arial, sans-serif; height: 100vh;">

    <div class="row g-0 bg-white shadow overflow-hidden w-100 h-100">

      <!-- ================= PARTIE GAUCHE ================= -->
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
            Connectez-vous pour accéder à votre espace collaboratif.
          </h4>
          <p class="text-white-50 mb-0" style="font-size: 12px; line-height: 1.5; max-width: 300px;">
            La plateforme centralisée pour mener à bien les sourcing.
          </p>
        </div>

      </div>

      <!-- ================= PARTIE DROITE ================= -->
      <div class="col-md-6 d-flex flex-column justify-content-center" style="padding: 48px 48px 40px 48px;">

        <div class="w-100">

          <!-- Header -->
          <div class="mb-5">
            <h2 class="fw-bold mb-3" style="font-size: 28px; color: #111827; line-height: 1.2;">
              Connexion
            </h2>
            <p class="text-secondary mb-0" style="font-size: 14px;">
              Accédez à votre compte pour continuer.
            </p>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="handleLogin" class="w-100">

            <!-- Email -->
            <div class="mb-4">
              <label for="email" class="form-label fw-medium" style="font-size: 14px; color: #1F2937; padding: 0; margin-bottom: 10px;">
                Adresse email
              </label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0" style="border: 1px solid #E5E7EB; border-right: none; padding: 0 16px;">
                  <i class="bi bi-envelope" style="font-size: 18px; color: #9CA3AF;"></i>
                </span>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control border-start-0"
                  style="height: 48px; font-size: 14px; border: 1px solid #E5E7EB; border-left: none; background-color: #FFFFFF;"
                  placeholder="exemple@simplon.co"
                  required
                >
              </div>
            </div>

            <!-- Mot de passe -->
            <div class="mb-4">
              <label for="password" class="form-label fw-medium" style="font-size: 14px; color: #1F2937; padding: 0; margin-bottom: 10px;">
                Mot de passe
              </label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0" style="border: 1px solid #E5E7EB; border-right: none; padding: 0 16px;">
                  <i class="bi bi-lock" style="font-size: 18px; color: #9CA3AF;"></i>
                </span>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control border-start-0"
                  style="height: 48px; font-size: 14px; border: 1px solid #E5E7EB; border-left: none; background-color: #FFFFFF;"
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

            <!-- Options -->
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check d-flex align-items-center gap-2 mb-0" style="padding-left: 10px;">
                <input
                  id="remember"
                  v-model="form.remember"
                  class="form-check-input"
                  type="checkbox"
                  style="width: 16px; height: 16px; accent-color: #D20C4F; margin: 0;"
                >
                <label for="remember" class="form-check-label mb-0" style="font-size: 14px; color: #6B7280; cursor: pointer;">
                  Se souvenir de moi
                </label>
              </div>
              <a
                href="#"
                class="text-decoration-none fw-medium"
                style="font-size: 14px; color: #D20C4F;"
                @click.prevent="forgotPassword"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <!-- Bouton -->
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
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style="width: 18px; height: 18px; border-width: 2px;"></span>
                Connexion...
              </span>
              <span v-else>Connexion</span>
            </button>

          </form>

          <!-- Sécurité -->
          <div class="text-center mt-4">
            <span style="font-size: 12px; color: #A8AFB7; font-weight: 400;">
              <i class="bi bi-shield-check me-1"></i>Connexion sécurisée et chiffrée de bout en bout
            </span>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const showPassword = ref(false)
const hoverBtn = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    console.log('Email :', form.email)
    console.log('Password :', form.password)
    console.log('Remember :', form.remember)
    await new Promise(resolve => setTimeout(resolve, 1500))
  } catch (error) {
    console.error('Erreur de connexion :', error)
  } finally {
    loading.value = false
  }
}

const forgotPassword = () => {
  console.log('Mot de passe oublié')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>
