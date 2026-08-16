import { defineStore } from 'pinia'
import { getCampagnes, createCampagne, getCampagneById, updateCampagne, deleteCampagne } from '@/api/endpoints/campagnes'

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
    // Charge une seule campagne par son id (page détail)
    async fetchCampagneById(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await getCampagneById(id)
        this.campagneActive = data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // Met à jour une campagne existante
    async modifierCampagne(id, payload) {
      const { data } = await updateCampagne(id, payload)
      // On met à jour la campagne dans la liste locale, si elle y est déjà
      const index = this.items.findIndex((c) => c.id === id)
      if (index !== -1) this.items[index] = data
      return data
    },

    // Supprime une campagne par son id
    async supprimerCampagne(id) {
      await deleteCampagne(id)
      // On retire la campagne de la liste locale -> pas besoin de refaire un fetch complet
      this.items = this.items.filter((c) => c.id !== id)
    },

    async creerCampagne(payload) {
      const { data } = await createCampagne(payload)
      this.items.push(data)
      return data
    }
  },
})