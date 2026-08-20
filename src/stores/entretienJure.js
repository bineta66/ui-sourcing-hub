import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getEntretiensByJure, getEntretienById, getCandidatsByEntretien } from '@/services/entretiensService'

export const useEntretiensStore = defineStore('entretiens', () => {
  const entretiens = ref([])
  const entretienCourant = ref(null)
  const candidatsEntretien = ref([])
  const loading = ref(false)
  const entretiensCompletes = ref({}) // Format: "entretienId_candidatId_type"
  const entretiensEnCours = ref({}) // Format: "entretienId_candidatId_type"

  async function fetchEntretiens(jureId) {
    loading.value = true
    entretiens.value = await getEntretiensByJure(jureId)
    loading.value = false
  }

  async function fetchEntretienEtCandidats(entretienId) {
    loading.value = true
    entretienCourant.value = await getEntretienById(entretienId)
    candidatsEntretien.value = await getCandidatsByEntretien(entretienId)
    loading.value = false
  }

  function getEntretienStatus(entretienId, candidatId, type) {
    const key = `${entretienId}_${candidatId}_${type}`
    if (entretiensCompletes.value[key] === true) return 'termine'
    if (entretiensEnCours.value[key] === true) return 'encours'
    return 'afaire'
  }

  function isEntretienComplete(entretienId, candidatId, type) {
    const key = `${entretienId}_${candidatId}_${type}`
    return entretiensCompletes.value[key] === true
  }

  function markEntretienEnCours(entretienId, candidatId, type) {
    const key = `${entretienId}_${candidatId}_${type}`
    entretiensEnCours.value[key] = true
  }

  function markEntretienComplete(entretienId, candidatId, type) {
    const key = `${entretienId}_${candidatId}_${type}`
    entretiensCompletes.value[key] = true
    entretiensEnCours.value[key] = false
  }

  return { entretiens, entretienCourant, candidatsEntretien, loading, entretiensCompletes, entretiensEnCours, fetchEntretiens, fetchEntretienEtCandidats, getEntretienStatus, isEntretienComplete, markEntretienEnCours, markEntretienComplete }
})