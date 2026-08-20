import client from '@/api/axios'

/**
 * Service API pour la gestion des convocations et du scan QR code RI.
 */

// Scanner un QR code pour marquer la présence à la RI
export const scanQrCode = (payload) => {
  return client.post('/api/convocations/scan-qr/', payload)
}

// Récupérer les statistiques de présence et l'historique des scans pour une campagne
export const getPresences = (campagneId) => {
  const params = campagneId ? { campagne: campagneId } : {}
  return client.get('/api/convocations/presences/', { params })
}

// Récupérer la liste des convocations
export const getConvocations = (params = {}) => {
  return client.get('/api/convocations/', { params })
}

// Créer une nouvelle convocation (génère PDF et envoie l'email)
export const createConvocation = (payload) => {
  return client.post('/api/convocations/', payload)
}

// Télécharger le document PDF officiel de convocation avec QR code
export const downloadConvocationPdf = (id) => {
  return client.get(`/api/convocations/${id}/pdf/`, { responseType: 'blob' })
}

// Renvoyer l'email de convocation au candidat
export const resendConvocationEmail = (id) => {
  return client.post(`/api/convocations/${id}/renvoyer-email/`)
}

// Espace Candidat : Récupérer les convocations d'entretiens (après RI)
export const getMesConvocations = () => {
  return client.get('/api/candidat/mes-convocations/')
}
