import api from '../axios'

/**
 * Formulaires : liste des formulaires
 */
export const getFormulaires = (params) => api.get('/api/formulaires/', { params })

/**
 * Formulaires : détail d'un formulaire (ouvert aux formulaires publiés)
 */
export const getFormulaireById = (id) => api.get(`/api/formulaires/${id}/`)

/**
 * Formulaires : consultation publique d'un formulaire publié (AllowAny)
 */
export const getPublicFormulaireById = (id) => api.get(`/api/formulaires/${id}/public/`)

/**
 * Formulaires : soumettre les réponses d'un formulaire (AllowAny)
 * payload peut être { reponses: [...] } ou { nom, prenom, email, telephone, reponses: [...] }
 */
export const soumettreReponses = (id, payload) => {
  const data = Array.isArray(payload) ? { reponses: payload } : payload
  return api.post(`/api/formulaires/${id}/soumettre/`, data)
}

/**
 * Formulaires : récupérer mes réponses
 */
export const getMesReponses = (id) => api.get(`/api/formulaires/${id}/mes-reponses/`)

/**
 * Formulaires : créer un formulaire
 */
export const createFormulaire = (data) => api.post('/api/formulaires/', data)

/**
 * Formulaires : mettre à jour un formulaire
 */
export const updateFormulaire = (id, data) => api.patch(`/api/formulaires/${id}/`, data)

/**
 * Formulaires : supprimer un formulaire
 */
export const deleteFormulaire = (id) => api.delete(`/api/formulaires/${id}/`)

/**
 * Formulaires : publier un formulaire
 */
export const publierFormulaire = (id) => api.post(`/api/formulaires/${id}/publier/`)

/**
 * Formulaires : dépublier un formulaire
 */
export const depublierFormulaire = (id) => api.post(`/api/formulaires/${id}/depublier/`)

/**
 * Sections : liste des sections
 */
export const getSections = (params) => api.get('/api/sections/', { params })

/**
 * Sections : créer une section
 */
export const createSection = (data) => api.post('/api/sections/', data)

/**
 * Sections : mettre à jour une section
 */
export const updateSection = (id, data) => api.patch(`/api/sections/${id}/`, data)

/**
 * Sections : supprimer une section
 */
export const deleteSection = (id) => api.delete(`/api/sections/${id}/`)

/**
 * Questions : liste des questions
 */
export const getQuestions = (params) => api.get('/api/questions/', { params })

/**
 * Questions : créer une question
 */
export const createQuestion = (data) => api.post('/api/questions/', data)

/**
 * Questions : mettre à jour une question
 */
export const updateQuestion = (id, data) => api.patch(`/api/questions/${id}/`, data)

/**
 * Questions : supprimer une question
 */
export const deleteQuestion = (id) => api.delete(`/api/questions/${id}/`)

/**
 * Options : liste des options
 */
export const getOptions = (params) => api.get('/api/options/', { params })

/**
 * Options : créer une option
 */
export const createOption = (data) => api.post('/api/options/', data)

/**
 * Options : mettre à jour une option
 */
export const updateOption = (id, data) => api.patch(`/api/options/${id}/`, data)

/**
 * Options : supprimer une option
 */
export const deleteOption = (id) => api.delete(`/api/options/${id}/`)
