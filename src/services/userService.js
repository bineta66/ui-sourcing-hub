import api from '@/api/axios'

export function getUsers() {
  return api.get('api/accounts/users/')
}

export function getUserById(userId) {
  return api.get(`api/accounts/users/${userId}/`)
}

export function updateUser(userId, data) {
  return api.patch(`api/accounts/users/${userId}/`, data)
}

export function deleteUser(userId) {
  return api.delete(`api/accounts/users/${userId}/`)
}

export function inviteUser(data) {
  return api.post('api/accounts/users/', data)
}
