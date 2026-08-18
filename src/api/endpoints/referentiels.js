import api from '../axios'

export const getReferentiels = () => api.get('/api/referentiels/')
export const createReferentiel = (data) => api.post('/api/referentiels/', data)