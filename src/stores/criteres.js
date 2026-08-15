import { defineStore } from 'pinia'
import { getCriteres, createCritere } from '@/api/endpoints/criteres'

export const useCriteresStore = defineStore('criteres', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    // Charge la liste des critères depuis l'API
    async fetchCriteres() {
      this.loading = true
      try {
        const { data } = await getCriteres()
        this.items = data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // Crée un critère ET l'ajoute directement à la liste locale
    // -> évite de refaire un fetch complet juste après la création
    async ajouterCritere(nouveauCritere) {
      const { data } = await createCritere(nouveauCritere)
      this.items.push(data)
      return data // utile pour récupérer l'id fraîchement créé
    },
  },
})