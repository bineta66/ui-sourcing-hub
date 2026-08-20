import api from '../axios'

/**
 * Service API pour la gestion des candidatures.
 */

// Liste des candidatures (admin, filtrable par campagne: ?campagne=id)
export const getAdminCandidatures = (params = {}) => {
  return api.get('/api/admin/candidatures/', { params })
}

// Détail d'une candidature
export const getAdminCandidatureById = (id) => {
  return api.get(`/api/admin/candidatures/${id}/`)
}

// Création d'une candidature (formulaire public ou admin)
export const createCandidature = (data) => {
  return api.post('/api/candidatures/', data)
}

// Liste des candidats d'une campagne spécifique
export const getCampagneCandidats = (campagneId) => {
  return api.get(`/api/campagnes/${campagneId}/candidats/`)
}
