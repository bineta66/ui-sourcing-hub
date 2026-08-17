import { defineStore } from 'pinia'
import { getCampagnes } from '@/api/endpoints/campagnes'

export const useCampagnesStore = defineStore('campagnes', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCampagnes() {
      this.loading = true
      try {
        const { data } = await getCampagnes()
        this.items = data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
  },
})