import { defineStore } from 'pinia'
import {
  getReunionInformation,
  getCreneaux,
  getCampagneCandidats,
  getReunionConvocations,
  sendReunionConvocations,
  scanReunionPresence,
  getReunionStats,
  resendConvocationEmail,
} from '@/api/endpoints/reunionInformation'

export const useReunionStore = defineStore('reunion', {
  state: () => ({
    campagneId: null,
    reunionActive: null,
    creneaux: [],
    candidats: [],
    convocations: [],
    stats: {
      total: 0,
      present: 0,
      absent: 0,
      creneaux: [],
      historique: [],
    },
    lastScanResult: null,
    loading: false,
    scanProcessing: false,
    error: null,
  }),

  getters: {
    totalConvoques: (state) => state.stats.total || state.convocations.length || 0,
    presents: (state) => state.stats.present || 0,
    absents: (state) => state.stats.absent || 0,
    historiqueScans: (state) => state.stats.historique || [],
  },

  actions: {
    async fetchReunion(campagneId) {
      this.campagneId = campagneId
      this.loading = true
      this.error = null
      try {
        const { data } = await getReunionInformation(campagneId)
        this.reunionActive = data
        if (data?.id) {
          await Promise.all([
            this.fetchCreneaux(data.id),
            this.fetchStats(data.id),
          ])
        }
        return data
      } catch (err) {
        if (err.response?.status === 404) {
          this.reunionActive = null
          this.creneaux = []
        } else {
          this.error = err.response?.data?.detail || 'Erreur lors du chargement de la réunion.'
        }
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchCreneaux(reunionId) {
      try {
        const { data } = await getCreneaux(reunionId)
        this.creneaux = data
        return data
      } catch (err) {
        console.error('Erreur chargement créneaux:', err)
        return []
      }
    },

    async fetchCandidats(campagneId) {
      this.loading = true
      try {
        const { data } = await getCampagneCandidats(campagneId)
        this.candidats = data
        return data
      } catch (err) {
        console.error('Erreur chargement candidats:', err)
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchConvocations(reunionId, params = {}) {
      this.loading = true
      try {
        const { data } = await getReunionConvocations(reunionId, params)
        this.convocations = data
        return data
      } catch (err) {
        console.error('Erreur chargement convocations:', err)
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchStats(reunionId) {
      try {
        const { data } = await getReunionStats(reunionId)
        this.stats = data
        return data
      } catch (err) {
        console.error('Erreur chargement stats:', err)
        return null
      }
    },

    async sendConvocations(reunionId, { candidature_ids, creneau_id, envoyer_email = true }) {
      this.loading = true
      this.error = null
      try {
        const { data } = await sendReunionConvocations(reunionId, {
          candidature_ids,
          creneau_id,
          envoyer_email,
        })
        if (this.campagneId) {
          await this.fetchCandidats(this.campagneId)
        }
        await Promise.all([
          this.fetchConvocations(reunionId),
          this.fetchStats(reunionId),
          this.fetchCreneaux(reunionId),
        ])
        return data
      } catch (err) {
        this.error = err.response?.data?.detail || "Erreur lors de l'envoi des convocations."
        throw err
      } finally {
        this.loading = false
      }
    },

    async processScan(reunionId, token) {
      if (this.scanProcessing) return null
      this.scanProcessing = true
      this.lastScanResult = null
      try {
        const { data } = await scanReunionPresence(reunionId, {
          token: String(token).trim(),
        })
        this.lastScanResult = data

        if (data.success) {
          await this.fetchStats(reunionId)
        }
        return data
      } catch (err) {
        const errorData = err.response?.data || {
          success: false,
          message: 'Erreur réseau ou serveur lors du scan.',
        }
        this.lastScanResult = errorData
        return errorData
      } finally {
        this.scanProcessing = false
      }
    },

    async resendEmail(convocationId) {
      try {
        const { data } = await resendConvocationEmail(convocationId)
        return data
      } catch (err) {
        throw err
      }
    },
  },
})
