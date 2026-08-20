import { defineStore } from 'pinia'
import { getPresences, scanQrCode } from '@/api/endpoints/convocations'

export const useConvocationsStore = defineStore('convocations', {
  state: () => ({
    campagneId: null,
    totalConvoques: 0,
    presents: 0,
    enAttente: 0,
    historique: [],
    loading: false,
    scanProcessing: false,
    lastScanResult: null,
    error: null,
  }),

  actions: {
    setCampagneId(id) {
      this.campagneId = id
      this.fetchPresences()
    },

    async fetchPresences() {
      if (!this.campagneId) return
      this.loading = true
      this.error = null
      try {
        const { data } = await getPresences(this.campagneId)
        this.totalConvoques = data.total_convoques
        this.presents = data.presents
        this.enAttente = data.en_attente
        this.historique = data.historique || []
      } catch (err) {
        this.error = err.response?.data?.detail || 'Erreur lors du chargement des présences.'
      } finally {
        this.loading = false
      }
    },

    async processScan(qrToken) {
      if (this.scanProcessing) return null
      this.scanProcessing = true
      this.lastScanResult = null
      try {
        const { data } = await scanQrCode({
          qr_token: qrToken,
          campagne: this.campagneId,
        })
        this.lastScanResult = data

        // Si le scan est valide et a marqué une nouvelle présence
        if (data.success) {
          // Recharger les compteurs et l'historique
          await this.fetchPresences()
        }

        return data
      } catch (err) {
        const errorData = err.response?.data || { success: false, message: 'Erreur réseau ou serveur lors du scan.' }
        this.lastScanResult = errorData
        return errorData
      } finally {
        this.scanProcessing = false
      }
    },
  },
})
