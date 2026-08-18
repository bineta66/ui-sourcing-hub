import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  const access = ref(localStorage.getItem('auth_access'))
  const refresh = ref(localStorage.getItem('auth_refresh'))
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
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
