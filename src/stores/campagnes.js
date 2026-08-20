import { defineStore } from 'pinia'
import { getCampagnes, createCampagne, getCampagneById, updateCampagne, deleteCampagne } from '@/api/endpoints/campagnes'

const mapCampagnePayload = (payload) => {
  return {
    title: payload.title,
    description: payload.description,
    begin_date: payload.begin_date,
    end_date: payload.end_date,
    status: payload.status || 'brouillon',
    // Le serializer Django (CampagneSerializer) attend explicitement 'referentiel_id' et 'criteres_ids'
    referentiel_id: payload.referentiel_id !== undefined ? payload.referentiel_id : payload.referentiel,
    criteres_ids: payload.criteres_ids !== undefined ? payload.criteres_ids : (payload.criteres || []),
  }
}

export const useCampagnesStore = defineStore('campagnes', {
  state: () => ({
    items: [],
    campagneActive: null,
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
    async fetchCampagneById(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await getCampagneById(id)
        this.campagneActive = data
        return data
      } catch (err) {
        this.error = err
        this.campagneActive = null
        throw err
      } finally {
        this.loading = false
      }
    },

    // Alias pour compatibilité
    async getCampagne(id) {
      return this.fetchCampagneById(id)
    },

    async modifierCampagne(id, payload) {
      const { data } = await updateCampagne(id, mapCampagnePayload(payload))
      const index = this.items.findIndex((c) => c.id === id)
      if (index !== -1) this.items[index] = data
      return data
    },

    async supprimerCampagne(id) {
      await deleteCampagne(id)
      this.items = this.items.filter((c) => c.id !== id)
    },

    async creerCampagne(payload) {
      const { data } = await createCampagne(mapCampagnePayload(payload))
      this.items.push(data)
      return data
    }
  },
})

// Alias export pour les composants utilisant le singulier
export const useCampagneStore = useCampagnesStore