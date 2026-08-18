import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Inscription from '../views/Inscription.vue'
import MotDePasseOublie from '../views/MotDePasseOublie.vue'
import CreationUtilisateur from '../views/CreationUtilisateur.vue'
import GestionUtilisateurs from '../views/GestionUtilisateurs.vue'
import DetailUtilisateur from '../views/DetailUtilisateur.vue'
import Campagnes from '../views/campagnes/CampagnesDashboard.vue'
import CreateCampagne from '../views/campagnes/CreateCampagne.vue'
import UpdateCampagne from '../views/campagnes/UpdateCampagne.vue'
import DetailCampagne from '../views/campagnes/DetailCampagne.vue'
import FormBuilderView from '../views/admin/FormBuilderView.vue'
import Candidature from '../views/Candidature.vue'
import CandidateEntretiens from '../views/candidate/CandidateEntretiens.vue'
import CandidateTests from '../views/candidate/CandidateTests.vue'
import CandidateCandidature from '../views/candidate/CandidateCandidature.vue'
import CandidateProfile from '../views/candidate/Profile.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/inscription',
      name: 'Inscription',
      component: Inscription,
      meta: { requiresGuest: true }
    },
    {
      path: '/mot-de-passe-oublie',
      name: 'MotDePasseOublie',
      component: MotDePasseOublie,
      meta: { requiresGuest: true }
    },
    {
      path: '/creation-utilisateur',
      name: 'CreationUtilisateur',
      component: CreationUtilisateur,
      meta: { requiresGuest: true }
    },
    {
      path: '/gestion-utilisateurs',
      name: 'GestionUtilisateurs',
      component: GestionUtilisateurs,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/detail-utilisateur/:id',
      name: 'DetailUtilisateur',
      component: DetailUtilisateur,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/campagnes',
      name: 'campagnes',
      component: Campagnes,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/campagnes/create',
      name: 'create-campagne',
      component: CreateCampagne,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/campagnes/update/:id',
      name: 'update-campagne',
      component: UpdateCampagne,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/campagnes/detail/:id',
      name: 'detail-campagne',
      component: DetailCampagne,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/form-builder/:campaignId?',
      name: 'campaign-form-builder',
      component: FormBuilderView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/candidature/:slug',
      name: 'candidature',
      component: Candidature
    },
    {
      path: '/candidate/entretiens',
      name: 'candidate-entretiens',
      component: CandidateEntretiens
    },
    {
      path: '/candidate/tests',
      name: 'candidate-tests',
      component: CandidateTests
    },
    {
      path: '/candidate/candidature',
      name: 'candidate-candidature',
      component: CandidateCandidature
    },
    {
      path: '/candidate/profil',
      name: 'candidate-profile',
      component: CandidateProfile
    }
  ],
})

router.beforeEach(async (to, from) => {
  const auth = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const requiresGuest = to.meta.requiresGuest

  if (requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  if (requiresAdmin && !auth.isAdmin) {
    return '/campagnes'
  }

  if (requiresGuest && auth.isAuthenticated) {
    return '/campagnes'
  }

  if (requiresAuth && auth.isAuthenticated) {
    await auth.checkAuth()
    if (requiresAdmin && !auth.isAdmin) {
      return '/campagnes'
    }
  }

  return true
})

export default router
