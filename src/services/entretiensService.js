import { mockEntretiens, mockCandidatsEntretien } from '@/data/mockEntretien'
import { mockQuestions } from '@/data/mockQuestions'

export async function getEntretiensByJure(jureId) {
  // TODO API: return axios.get(`/api/jures/${jureId}/entretiens`).then(r => r.data)
  return mockEntretiens.filter(e => e.jureId === jureId)
}

export async function getEntretienById(entretienId) {
  // TODO API: return axios.get(`/api/entretiens/${entretienId}`).then(r => r.data)
  return mockEntretiens.find(e => e.id === Number(entretienId))
}

export async function getCandidatsByEntretien(entretienId) {
  // TODO API: return axios.get(`/api/entretiens/${entretienId}/candidats`).then(r => r.data)
  const entretien = mockEntretiens.find(e => e.id === Number(entretienId))
  if (!entretien) return []
  return mockCandidatsEntretien.filter(c => entretien.candidatsIds.includes(c.id))
}

export async function getQuestionsByType(type) {
  // TODO API: return axios.get(`/api/entretiens/questions?type=${type}`).then(r => r.data)
  return mockQuestions[type] ?? []
}

export async function soumettreEntretien(payload) {
  // payload: { candidatId, entretienId, type, reponses: [{questionId, commentaire}] }
  // TODO API: return axios.post(`/api/entretiens/${payload.entretienId}/soumettre`, payload)
  console.log('Entretien soumis (mock) :', payload)
  return { success: true }
}