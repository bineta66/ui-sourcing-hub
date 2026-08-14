import api from '../axios'

export const getCampagnes = (params) => api.get('/api/campagnes/', { params })
export const getCampagneById = (id) => api.get(`/api/campagnes/${id}/`)
export const createCampagne = (data) => api.post('/api/campagnes/', data)
export const updateCampagne = (id, data) => api.patch(`/api/campagnes/${id}/`, data)
export const deleteCampagne = (id) => api.delete(`/api/campagnes/${id}/`)