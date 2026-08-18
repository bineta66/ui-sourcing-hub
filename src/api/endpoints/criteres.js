import api from '../axios'

// Récupère tous les critères existants
export const getCriteres = () => api.get('/api/criteres/')

// Crée un nouveau critère (nom + description)
export const createCritere = (data) => api.post('/api/criteres/', data)