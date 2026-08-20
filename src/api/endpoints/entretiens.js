import client from '@/api/axios'

/**
 * Service API pour la gestion et la planification des sessions d'entretiens.
 */

// Récupérer la liste des sessions d'entretiens (avec filtres optionnels : campagne, type, statut, date)
export const getEntretiens = (params = {}) => {
  return client.get('/api/entretiens/', { params })
}

// Récupérer les détails complets d'une session d'entretien
export const getEntretienDetail = (id) => {
  return client.get(`/api/entretiens/${id}/`)
}

// Créer une nouvelle session d'entretien (brouillon ou planifiée avec créneaux et jurys)
export const createEntretien = (payload) => {
  return client.post('/api/entretiens/', payload)
}

// Mettre à jour les informations d'une session d'entretien
export const updateEntretien = (id, payload) => {
  return client.patch(`/api/entretiens/${id}/`, payload)
}

// Supprimer une session d'entretien
export const deleteEntretien = (id) => {
  return client.delete(`/api/entretiens/${id}/`)
}

// Action principale : Confirmer la session et envoyer les convocations officielles
export const confirmerEtEnvoyerConvocations = (id, payload = { envoyer_emails: true }) => {
  return client.post(`/api/entretiens/${id}/confirmer-et-convoquer/`, payload)
}

// Consulter le planning structuré par membre du jury
export const getPlanningJurys = (id) => {
  return client.get(`/api/entretiens/${id}/planning-jurys/`)
}

// Espace Candidat : Récupérer les convocations d'entretiens pour le candidat connecté
export const getMesConvocationsEntretien = () => {
  return client.get('/api/candidat/entretiens/mes-convocations/')
}

// Créneaux d'entretiens
export const createCreneauEntretien = (payload) => {
  return client.post('/api/creneaux-entretiens/', payload)
}

export const updateCreneauEntretien = (id, payload) => {
  return client.patch(`/api/creneaux-entretiens/${id}/`, payload)
}

export const deleteCreneauEntretien = (id) => {
  return client.delete(`/api/creneaux-entretiens/${id}/`)
}
