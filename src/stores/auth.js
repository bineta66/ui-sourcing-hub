import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  let storedUser = null
  try {
    storedUser = JSON.parse(localStorage.getItem('auth_user') || 'null')
  } catch (e) {
    storedUser = null
  }
  const access = ref(localStorage.getItem('auth_access'))
  const refresh = ref(localStorage.getItem('auth_refresh'))
  const user = ref(storedUser)
  const loading = ref(false)
  const error = ref(null)

  const token = computed(() => access.value)
  const isAuthenticated = computed(() => !!access.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/api/accounts/login/', credentials)
      access.value = data.access
      refresh.value = data.refresh
      user.value = data.user || { email: credentials.email }
      localStorage.setItem('auth_access', access.value)
      localStorage.setItem('auth_refresh', refresh.value)
      localStorage.setItem('auth_user', JSON.stringify(user.value))
      if (access.value) {
        api.defaults.headers.common.Authorization = `Bearer ${access.value}`
      }
      return data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message || 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkAuth() {
    if (!access.value) return false
    try {
      api.defaults.headers.common.Authorization = `Bearer ${access.value}`
      const { data } = await api.get('/api/campagnes/')
      return true
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
        return false
      }
      return true
    }
  }

  async function logout() {
    try {
      if (refresh.value) {
        api.defaults.headers.common.Authorization = `Bearer ${access.value}`
        await api.post('/api/accounts/logout/', { refresh: refresh.value })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      access.value = null
      refresh.value = null
      user.value = null
      localStorage.removeItem('auth_access')
      localStorage.removeItem('auth_refresh')
      localStorage.removeItem('auth_user')
      delete api.defaults.headers.common.Authorization
    }
  }

  if (access.value) {
    api.defaults.headers.common.Authorization = `Bearer ${access.value}`
  }

  return {
    token,
    access,
    refresh,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    checkAuth,
    logout,
  }
})
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
