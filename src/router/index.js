import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Login from '../views/Login.vue'
import Inscription from '../views/Inscription.vue'
import MotDePasseOublie from '../views/MotDePasseOublie.vue'
import ResetPasswordConfirm from '../views/ResetPasswordConfirm.vue'
import CreationUtilisateur from '../views/CreationUtilisateur.vue'
import GestionUtilisateurs from '../views/GestionUtilisateurs.vue'
import DetailUtilisateur from '../views/DetailUtilisateur.vue'
import Campagnes from '../views/campagnes/CampagnesDashboard.vue'
import CreateCampagne from '../views/campagnes/CreateCampagne.vue'
import UpdateCampagne from '../views/campagnes/UpdateCampagne.vue'
import DetailCampagne from '../views/campagnes/DetailCampagne.vue'

const routes = [
  {
    path: '/',
    redirect: () => {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
      return token ? '/campagnes' : '/login'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: Inscription,
    meta: { guestOnly: true },
  },
  {
    path: '/activate',
    name: 'AccountActivate',
    component: Inscription,
    meta: { guestOnly: true },
  },
  {
    path: '/mot-de-passe-oublie',
    name: 'MotDePasseOublie',
    component: MotDePasseOublie,
    meta: { guestOnly: true },
  },
  {
    path: '/reset-password/:uid/:token',
    name: 'ResetPasswordConfirm',
    component: ResetPasswordConfirm,
    meta: { guestOnly: true },
  },
  {
    path: '/gestion-utilisateurs',
    name: 'GestionUtilisateurs',
    component: GestionUtilisateurs,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
  {
    path: '/creation-utilisateur',
    name: 'CreationUtilisateur',
    component: CreationUtilisateur,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
  {
    path: '/detail-utilisateur/:id',
    name: 'DetailUtilisateur',
    component: DetailUtilisateur,
    meta: { requiresAuth: true },
  },
  {
    path: '/campagnes',
    name: 'Campagnes',
    component: Campagnes,
    meta: { requiresAuth: true },
  },
  {
    path: '/campagnes/create',
    name: 'CreateCampagne',
    component: CreateCampagne,
    meta: { requiresAuth: true },
  },
  {
    path: '/campagnes/update',
    name: 'UpdateCampagne',
    component: UpdateCampagne,
    meta: { requiresAuth: true },
  },
  {
    path: '/campagnes/detail',
    name: 'DetailCampagne',
    component: DetailCampagne,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return next('/campagnes')
  }

  if (to.meta.roles && to.meta.roles.length > 0) {
    const userRole = authStore.user?.role
    if (!userRole || !to.meta.roles.includes(userRole)) {
      return next('/campagnes')
    }
  }

  next()
})

export default router