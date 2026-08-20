import { defineStore } from 'pinia'
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '@/services/userService'

const roleLabels = {
  ADMIN: { label: 'Administrateur', class: 'bg-primary' },
  CANDIDAT: { label: 'Candidat', class: 'bg-success' },
  JURY: { label: 'Jury', class: 'bg-warning' },
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [],
    current: null,
    loading: false,
    error: null,
  }),

  getters: {
    count: (state) => state.items.length,
    activeCount: (state) => state.items.filter((u) => u.is_active !== false).length,
    inactiveCount: (state) => state.items.filter((u) => u.is_active === false).length,
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const { data } = await getUsers()
        this.items = data.results || data
      } catch (err) {
        this.error =
          err.response?.data?.detail ||
          err.message ||
          'Erreur lors du chargement des utilisateurs.'
        this.items = []
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(userId) {
      this.loading = true
      this.error = null
      try {
        const { data } = await getUserById(userId)
        this.current = data
        return this.current
      } catch (err) {
        this.error =
          err.response?.data?.detail ||
          err.message ||
          "Erreur lors du chargement de l'utilisateur."
        this.current = null
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateUser(userId, payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await updateUser(userId, payload)
        const index = this.items.findIndex((u) => u.id === Number(userId))
        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...data }
        }
        if (this.current?.id === Number(userId)) {
          this.current = { ...this.current, ...data }
        }
        return this.items[index]
      } catch (err) {
        this.error =
          err.response?.data?.detail ||
          err.message ||
          'Erreur lors de la mise à jour.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteUser(userId) {
      this.loading = true
      this.error = null
      try {
        await deleteUser(userId)
        this.items = this.items.filter((u) => u.id !== Number(userId))
        if (this.current?.id === Number(userId)) {
          this.current = null
        }
      } catch (err) {
        this.error =
          err.response?.data?.detail ||
          err.message ||
          'Erreur lors de la suppression.'
        throw err
      } finally {
        this.loading = false
      }
    },

    roleLabel(role) {
      return roleLabels[role]?.label || role || '—'
    },

    roleBadgeClass(role) {
      return roleLabels[role]?.class || 'bg-secondary'
    },

    formatStatus(isActive) {
      return isActive ? { label: 'Actif', class: 'bg-success' } : { label: 'Inactif', class: 'bg-secondary' }
    },
  },
})
