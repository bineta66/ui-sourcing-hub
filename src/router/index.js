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
      component: Login
    },
    {
      path: '/inscription',
      name: 'Inscription',
      component: Inscription
    },
    {
      path: '/mot-de-passe-oublie',
      name: 'MotDePasseOublie',
      component: MotDePasseOublie
    },
    {
      path: '/creation-utilisateur',
      name: 'CreationUtilisateur',
      component: CreationUtilisateur
    },
    {
      path: '/gestion-utilisateurs',
      name: 'GestionUtilisateurs',
      component: GestionUtilisateurs
    },
    {
      path: '/detail-utilisateur/:id',
      name: 'DetailUtilisateur',
      component: DetailUtilisateur
    },
    {
      path: '/campagnes',
      name: 'campagnes',
      component: Campagnes
    },
    {
      path: '/campagnes/create',
      name: 'create-campagne',
      component: CreateCampagne
    },
    {
      path: '/campagnes/update/',
      name: 'update-campagne',
      component: UpdateCampagne
    },
    {
      path: '/campagnes/detail/',
      name: 'detail-campagne',
      component: DetailCampagne
    },
    {
      path: '/form-builder/:campaignId?',
      name: 'campaign-form-builder',
      component: FormBuilderView
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
      path: '/candidate/profile',
      name: 'candidate-profile',
      component: CandidateProfile
    }
  ],
})

export default router
