import api from '../axios'

export const getReunionInformation = (campagneId) =>
  api.get(`/api/campagnes/${campagneId}/reunion-information/`)

export const createReunionInformation = (campagneId, data) =>
  api.post(`/api/campagnes/${campagneId}/reunion-information/`, data)

export const updateReunionInformation = (campagneId, data) =>
  api.patch(`/api/campagnes/${campagneId}/reunion-information/`, data)

export const deleteReunionInformation = (campagneId) =>
  api.delete(`/api/campagnes/${campagneId}/reunion-information/`)

export const getCreneaux = (reunionId) =>
  api.get(`/api/reunions/${reunionId}/creneaux/`)

export const createCreneau = (reunionId, data) =>
  api.post(`/api/reunions/${reunionId}/creneaux/`, data)

export const updateCreneau = (creneauId, data) =>
  api.patch(`/api/creneaux-ri/${creneauId}/`, data)

export const deleteCreneau = (creneauId) =>
  api.delete(`/api/creneaux-ri/${creneauId}/`)

// Liste des candidats d'une campagne
export const getCampagneCandidats = (campagneId) =>
  api.get(`/api/campagnes/${campagneId}/candidats/`)

// Liste des convocations d'une RI
export const getReunionConvocations = (reunionId, params = {}) =>
  api.get(`/api/reunions/${reunionId}/convocations/`, { params })

// Envoi en lot de convocations RI avec affectation de créneau
export const sendReunionConvocations = (reunionId, data) =>
  api.post(`/api/reunions/${reunionId}/convocations/`, data)

// Scan QR code et pointage de présence
export const scanReunionPresence = (reunionId, data) =>
  api.post(`/api/reunions/${reunionId}/presence/`, data)

// Statistiques de la RI
export const getReunionStats = (reunionId) =>
  api.get(`/api/reunions/${reunionId}/stats/`)

// Téléchargement du PDF de convocation
export const downloadConvocationPdf = (convocationId) =>
  api.get(`/api/convocations-ri/${convocationId}/pdf/`, { responseType: 'blob' })

// Renvoyer l'email de convocation
export const resendConvocationEmail = (convocationId) =>
  api.post(`/api/convocations-ri/${convocationId}/renvoyer-email/`)

// Consultation publique de la convocation sans connexion
export const getPublicConvocation = (token) =>
  api.get(`/api/convocations-ri/public/${token}/`)

