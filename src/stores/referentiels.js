import { defineStore } from 'pinia'
import { getReferentiels, createReferentiel } from '@/api/endpoints/referentiels'

export const useReferentielsStore = defineStore('referentiels', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchReferentiels() {
      this.loading = true
      try {
        const { data } = await getReferentiels()
        this.items = data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async ajouterReferentiel(nouveauReferentiel) {
      const { data } = await createReferentiel(nouveauReferentiel)
      this.items.push(data)
      return data
    },
  },
})