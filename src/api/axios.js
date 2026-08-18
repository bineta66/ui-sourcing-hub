import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/'

const api = axios.create({
  baseURL: baseURL.endsWith('/') ? baseURL : `${baseURL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper to get active storage
const getStorage = () => {
  return localStorage.getItem('access_token') ? localStorage : sessionStorage
}

// Request Interceptor: Attach JWT Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle 401 & Silent Refresh Token
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Check if error is 401, not already retried, and not an auth attempt (login/refresh)
    const isAuthRequest = originalRequest?.url?.includes('/accounts/login/') || originalRequest?.url?.includes('/accounts/token/refresh/')
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      const storage = getStorage()
      const refreshToken = storage.getItem('refresh_token')

      if (!refreshToken) {
        // No refresh token available, purge and let caller handle error
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        sessionStorage.removeItem('user')
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Queue the request until refreshing finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(`${api.defaults.baseURL}api/accounts/token/refresh/`, {
          refresh: refreshToken,
        })

        const newAccessToken = response.data.access
        const newRefreshToken = response.data.refresh || refreshToken

        storage.setItem('access_token', newAccessToken)
        if (response.data.refresh) {
          storage.setItem('refresh_token', newRefreshToken)
        }

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        sessionStorage.removeItem('user')
        
        // Redirect to login if in browser environment
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api