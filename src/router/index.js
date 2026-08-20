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
import FormBuilderView from '../views/admin/FormBuilderView.vue'
import ScannerPresenceRI from '../views/admin/ScannerPresenceRI.vue'
import Candidature from '../views/Candidature.vue'
import CandidateEntretiens from '../views/candidate/CandidateEntretiens.vue'
import CandidateTests from '../views/candidate/CandidateTests.vue'
import CandidateCandidature from '../views/candidate/CandidateCandidature.vue'
import CandidateProfile from '../views/candidate/Profile.vue'
import EntretiensDashboard from '../views/entretiens/EntretiensDashboard.vue'
import PlanifierEntretien from '../views/entretiens/PlanifierEntretien.vue'
import ListeEntretien from '../views/jure/ListeEntretien.vue'
import CandidatsEntretien from '../views/jure/CandidatsEntretien.vue'
import EntretienTechnique from '../views/jure/EntretienTechnique.vue'
import EntretienMotivation from '../views/jure/EntretienMotivation.vue'
import DetailCandidat from '@/views/jure/DetailCandidat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Root',
      redirect: () => {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return '/login'
        return auth.isCandidate ? '/candidate/entretiens' : '/campagnes'
      },
    },
    // Routes Publiques / Visiteurs
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
      name: 'Activate',
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
    // Formulaire de candidature public (Accessible publiquement sans connexion ni JWT)
    {
      path: '/formulaire/:id',
      name: 'formulaire-public',
      component: Candidature,
    },
    {
      path: '/candidature/:id',
      name: 'candidature',
      component: Candidature,
    },
    // Espace Admin / Gestion Utilisateurs
    {
      path: '/gestion-utilisateurs',
      name: 'GestionUtilisateurs',
      component: GestionUtilisateurs,
      meta: { requiresAuth: true, requiresAdmin: true, roles: ['ADMIN'] },
    },
    {
      path: '/creation-utilisateur',
      name: 'CreationUtilisateur',
      component: CreationUtilisateur,
      meta: { requiresAuth: true, requiresAdmin: true, roles: ['ADMIN'] },
    },
    {
      path: '/detail-utilisateur/:id',
      name: 'DetailUtilisateur',
      component: DetailUtilisateur,
      meta: { requiresAuth: true, requiresAdmin: true, roles: ['ADMIN'] },
    },
    // Espace Campagnes (Admin / Jury)
    {
      path: '/campagnes',
      name: 'campagnes',
      component: Campagnes,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    {
      path: '/campagnes/create',
      name: 'create-campagne',
      component: CreateCampagne,
      meta: { requiresAuth: true, requiresAdmin: true, roles: ['ADMIN'] },
    },
    {
      path: '/campagnes/update/:id?',
      name: 'update-campagne',
      component: UpdateCampagne,
      meta: { requiresAuth: true, requiresAdmin: true, roles: ['ADMIN'] },
    },
    {
      path: '/campagnes/:id',
      name: 'campagne-detail',
      component: DetailCampagne,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    {
      path: '/campagnes/detail/:id?',
      name: 'detail-campagne',
      component: DetailCampagne,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    {
      path: '/form-builder/:campaignId?/:formulaireId?',
      name: 'campaign-form-builder',
      component: FormBuilderView,
      meta: { requiresAuth: true, requiresAdmin: true, roles: ['ADMIN'] },
    },
    // Espace Entretiens (Admin / Jury)
    {
      path: '/entretiens',
      name: 'entretiens',
      component: EntretiensDashboard,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    {
      path: '/entretiens/planifier',
      name: 'planifier-entretien',
      component: PlanifierEntretien,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    // Scanner Présences RI (Admin)
    {
      path: '/reunions/:reunionId/scanner',
      name: 'scanner-presence-ri-reunion',
      component: ScannerPresenceRI,
      meta: { requiresAuth: true, requiresAdmin: true, roles: ['ADMIN'] },
    },
    {
      path: '/admin/presences-ri/:campagneId?',
      name: 'scanner-presence-ri',
      component: ScannerPresenceRI,
      meta: { requiresAuth: true, requiresAdmin: true, roles: ['ADMIN'] },
    },
    {
      path: '/scanner-presence-ri',
      redirect: '/admin/presences-ri',
    },
    // Espace Candidat
    {
      path: '/candidate/entretiens',
      name: 'candidate-entretiens',
      component: CandidateEntretiens,
      meta: { requiresAuth: true, roles: ['CANDIDAT'] },
    },
    {
      path: '/candidate/tests',
      name: 'candidate-tests',
      component: CandidateTests,
      meta: { requiresAuth: true, roles: ['CANDIDAT'] },
    },
    {
      path: '/candidate/candidature',
      name: 'candidate-candidature',
      component: CandidateCandidature,
      meta: { requiresAuth: true, roles: ['CANDIDAT'] },
    },
    {
      path: '/candidate/profil',
      name: 'candidate-profile',
      component: CandidateProfile,
      meta: { requiresAuth: true, roles: ['CANDIDAT'] },
    },
      // Espace Jury - Entretiens 
    {
      path: '/jury/entretiens',
      name: 'jury-entretiens-liste',
      component: ListeEntretien,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    {
      path: '/jury/entretiens/:entretienId/candidats',
      name: 'jury-candidats-entretien',
      component: CandidatsEntretien,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    {
      path: '/jury/entretiens/:entretienId/candidats/:candidatId/technique',
      name: 'jury-entretien-technique',
      component: EntretienTechnique,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    {
      path: '/jury/entretiens/:entretienId/candidats/:candidatId/motivation',
      name: 'jury-entretien-motivation',
      component: EntretienMotivation,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    // Redirection pour l'ancienne URL
    {
      path: '/entretiensjury',
      redirect: '/jury/entretiens',
    },{
      path: '/entretiensjury',
      name: 'ListeEntretiens',
      component: ListeEntretien,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    {
      path: '/entretiensjury/:entretienId/candidats',
      name: 'CandidatsEntretien',
      component: CandidatsEntretien,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] }
    },
    {
      path: '/jury/entretiens/:entretienId/candidats/:candidatId',
      name: 'jury-candidat-detail',
      component: DetailCandidat,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] },
    },
    {
      path: '/candidats/:id/technique',
      name: 'EntretienTechnique',
      component: EntretienTechnique,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] }
    },
    {
      path: '/candidats/:id/motivation',
      name: 'EntretienMotivation',
      component: EntretienMotivation,
      meta: { requiresAuth: true, roles: ['ADMIN', 'JURY'] }
    },
  ],
})

router.beforeEach((to, from) => {
  const auth = useAuthStore()

  const getDefaultHome = () => {
    if (auth.isCandidate) return '/candidate/entretiens'
    return '/campagnes'
  }

  // Redirection des utilisateurs déjà connectés accédant à une page 'guestOnly'
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return getDefaultHome()
  }

  // Redirection des utilisateurs non connectés accédant à une page protégée
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      path: '/login',
      query: to.fullPath && to.fullPath !== '/' ? { redirect: to.fullPath } : undefined,
    }
  }

  // Contrôle des rôles pour les pages protégées
  if (to.meta.requiresAuth && auth.isAuthenticated) {
    if (to.meta.requiresAdmin && !auth.isAdmin) {
      return getDefaultHome()
    }
    if (to.meta.roles && Array.isArray(to.meta.roles) && !to.meta.roles.includes(auth.userRole)) {
      return getDefaultHome()
    }
  }

  return true
})

export default router
