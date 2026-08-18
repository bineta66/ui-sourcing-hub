import api from '../axios'

/**
 * Authentification : Connexion (JWT)
 * @param {Object} credentials - { email, password }
 * @returns {Promise} { access, refresh, user: { id, email, role } }
 */
export const loginApi = (credentials) => api.post('api/accounts/login/', credentials)

/**
 * Authentification : Déconnexion et révocation du refresh token
 * @param {string} refreshToken
 * @returns {Promise} { detail }
 */
export const logoutApi = (refreshToken) => api.post('api/accounts/logout/', { refresh: refreshToken })

/**
 * Authentification : Rafraîchissement du token access
 * @param {string} refreshToken
 * @returns {Promise} { access, refresh }
 */
export const refreshTokenApi = (refreshToken) => api.post('api/accounts/token/refresh/', { refresh: refreshToken })

/**
 * Administration : Invitation d'un utilisateur par un ADMIN
 * @param {Object} data - { email, role: 'ADMIN' | 'JURY' | 'CANDIDAT' }
 * @returns {Promise} { detail, user: { id, email, role, status } }
 */
export const inviteUserApi = (data) => api.post('api/accounts/users/', data)

/**
 * Gestion de compte : Activation de compte via token d'invitation
 * @param {Object} data - { token, password, password_confirm }
 * @returns {Promise} { detail }
 */
export const activateAccountApi = (data) => api.post('api/accounts/activate/', data)

/**
 * Profil : Complétion des informations de profil
 * @param {Object} data - { first_name, last_name, phone_number }
 * @returns {Promise} { detail, is_profile_complete }
 */
export const completeProfileApi = (data) => api.patch('api/accounts/profile/complete/', data)

/**
 * Sécurité : Demande de réinitialisation de mot de passe
 * @param {Object} data - { email }
 * @returns {Promise} { detail }
 */
export const requestPasswordResetApi = (data) => api.post('api/accounts/password-reset/', data)

/**
 * Sécurité : Confirmation du nouveau mot de passe
 * @param {string} uid
 * @param {string} token
 * @param {Object} data - { new_password, new_password_confirm }
 * @returns {Promise} { detail }
 */
export const confirmPasswordResetApi = (uid, token, data) =>
  api.post(`api/accounts/password-reset/confirm/${uid}/${token}/`, data)
