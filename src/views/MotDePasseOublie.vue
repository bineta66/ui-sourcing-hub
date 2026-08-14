<template>
  <div class="container-fluid d-flex align-items-center justify-content-center" style="background-color: #F8F9FA; padding: 0; font-family: 'Inter', Arial, sans-serif; height: 100vh;">

    <div class="row g-0 bg-white shadow overflow-hidden w-100 h-100">

      <!--  PARTIE GAUCHE  -->
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
            Réinitialisez votre mot de passe en toute sécurité.
          </h4>
          <p class="text-white-50 mb-0" style="font-size: 12px; line-height: 1.5; max-width: 300px;">
            Entrez votre adresse email pour recevoir un lien de réinitialisation.
          </p>
        </div>

      </div>

      <!--  PARTIE DROITE  -->
      <div class="col-md-6 d-flex flex-column justify-content-center" style="padding: 48px 48px 40px 48px; background-color: #FFFFFF;">

        <div class="w-100">

          <!-- Header -->
          <div class="mb-5">
            <h2 class="fw-bold mb-3" style="font-size: 28px; color: #111827; line-height: 1.2;">
              Mot de passe oublié ?
            </h2>
            <p class="text-secondary mb-0" style="font-size: 14px;">
              Nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="handleReset" class="w-100">

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
                Envoi en cours...
              </span>
              <span v-else>Réinitialiser le mot de passe</span>
            </button>

          </form>

          <!-- Lien vers login -->
          <div class="text-center mt-4">
            <span style="font-size: 12px; color: #6B7280; font-weight: 400;">
              <a href="/login" style="color: #D20C4F; text-decoration: none; font-weight: 500;">← Retour à la connexion</a>
            </span>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  email: ''
})

const loading = ref(false)
const hoverBtn = ref(false)

const handleReset = async () => {
  loading.value = true
  try {
    console.log('Réinitialisation demandée pour :', form.email)
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('Si un compte existe avec cette adresse, un email de réinitialisation vous sera envoyé.')
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la réinitialisation :', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>
