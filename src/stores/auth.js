import { defineStore } from 'pinia'
import {
  loginApi,
  logoutApi,
  refreshTokenApi,
  inviteUserApi,
  activateAccountApi,
  completeProfileApi,
  requestPasswordResetApi,
  confirmPasswordResetApi,
} from '@/api/endpoints/accounts'

const getStoredItem = (key) => {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || null
}

const getStoredUser = () => {
  const raw = getStoredItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getStoredUser(),
    accessToken: getStoredItem('access_token'),
    refreshToken: getStoredItem('refresh_token'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isJury: (state) => state.user?.role === 'JURY',
    isCandidate: (state) => state.user?.role === 'CANDIDAT',
    userRole: (state) => state.user?.role || '',
    userEmail: (state) => state.user?.email || '',
    displayName: (state) => {
      if (state.user?.first_name) {
        return `${state.user.first_name} ${state.user.last_name || ''}`.trim()
      }
      return state.user?.email ? state.user.email.split('@')[0] : 'Utilisateur'
    },
  },

  actions: {
    /**
     * Connexion utilisateur
     */
    async login({ email, password, remember = false }) {
      this.loading = true
      this.error = null
      try {
        const { data } = await loginApi({ email, password })

        this.accessToken = data.access
        this.refreshToken = data.refresh
        this.user = data.user

        const storage = remember ? localStorage : sessionStorage
        const otherStorage = remember ? sessionStorage : localStorage

        // Clear opposite storage to avoid desync
        otherStorage.removeItem('access_token')
        otherStorage.removeItem('refresh_token')
        otherStorage.removeItem('user')

        // Set in target storage
        storage.setItem('access_token', data.access)
        storage.setItem('refresh_token', data.refresh)
        storage.setItem('user', JSON.stringify(data.user))

        return data
      } catch (err) {
        const message =
          err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          'Identifiants invalides ou compte inactif.'
        this.error = message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Déconnexion
     */
    async logout() {
      this.loading = true
      try {
        if (this.refreshToken) {
          await logoutApi(this.refreshToken)
        }
      } catch (err) {
        console.warn('Logout API notification failed (token may be already revoked):', err)
      } finally {
        this.clearSession()
        this.loading = false
      }
    },

    /**
     * Nettoyage de la session locale
     */
    clearSession() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.error = null

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      sessionStorage.removeItem('user')
    },

    /**
     * Invitation d'un utilisateur (Réservé ADMIN)
     */
    async inviteUser({ email, role }) {
      this.loading = true
      this.error = null
      try {
        const { data } = await inviteUserApi({ email, role })
        return data
      } catch (err) {
        const detail =
          err.response?.data?.detail ||
          err.response?.data?.email?.[0] ||
          err.response?.data?.role?.[0] ||
          "Erreur lors de la création de l'utilisateur."
        this.error = detail
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Activation du compte via le token reçu par email
     */
    async activateAccount({ token, password, password_confirm }) {
      this.loading = true
      this.error = null
      try {
        const { data } = await activateAccountApi({
          token,
          password,
          password_confirm,
        })
        return data
      } catch (err) {
        const detail =
          err.response?.data?.detail ||
          err.response?.data?.password?.[0] ||
          err.response?.data?.token?.[0] ||
          "Erreur lors de l'activation du compte."
        this.error = detail
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Demande de réinitialisation de mot de passe
     */
    async requestPasswordReset(email) {
      this.loading = true
      this.error = null
      try {
        const { data } = await requestPasswordResetApi({ email })
        return data
      } catch (err) {
        const detail =
          err.response?.data?.detail ||
          err.response?.data?.email?.[0] ||
          "Erreur lors de la demande de réinitialisation."
        this.error = detail
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Confirmation de réinitialisation de mot de passe
     */
    async confirmPasswordReset({ uid, token, new_password, new_password_confirm }) {
      this.loading = true
      this.error = null
      try {
        const { data } = await confirmPasswordResetApi(uid, token, {
          new_password,
          new_password_confirm,
        })
        return data
      } catch (err) {
        const detail =
          err.response?.data?.detail ||
          err.response?.data?.new_password?.[0] ||
          'Lien invalide ou expiré.'
        this.error = detail
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Complétion du profil utilisateur
     */
    async completeProfile({ first_name, last_name, phone_number }) {
      this.loading = true
      this.error = null
      try {
        const { data } = await completeProfileApi({
          first_name,
          last_name,
          phone_number,
        })
        if (this.user) {
          this.user = {
            ...this.user,
            first_name,
            last_name,
            phone_number,
            is_profile_complete: true,
          }
          const storage = localStorage.getItem('user') ? localStorage : sessionStorage
          storage.setItem('user', JSON.stringify(this.user))
        }
        return data
      } catch (err) {
        const detail =
          err.response?.data?.detail ||
          err.response?.data?.first_name?.[0] ||
          err.response?.data?.last_name?.[0] ||
          'Erreur lors de la mise à jour du profil.'
        this.error = detail
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
