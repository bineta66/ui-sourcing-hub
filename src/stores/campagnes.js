import { defineStore } from 'pinia'
import { getCampagnes, createCampagne  } from '@/api/endpoints/campagnes'

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
    async creerCampagne(payload) {
      const { data } = await createCampagne(payload)
      this.items.push(data)
      return data
    }
  },
})