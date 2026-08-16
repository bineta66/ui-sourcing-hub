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

// const routes = [
//   {
//     path: '/',
//     redirect: '/login'
//   },
//   {
//     path: '/login',
//     name: 'Login',
//     component: Login
//   },
//   {
//     path: '/inscription',
//     name: 'Inscription',
//     component: Inscription
//   },
//   {
//     path: '/mot-de-passe-oublie',
//     name: 'MotDePasseOublie',
//     component: MotDePasseOublie
//   },
//   {
//     path: '/creation-utilisateur',
//     name: 'CreationUtilisateur',
//     component: CreationUtilisateur
//   },
//   {
//     path: '/gestion-utilisateurs',
//     name: 'GestionUtilisateurs',
//     component: GestionUtilisateurs
//   },
//   {
//     path: '/detail-utilisateur/:id',
//     name: 'DetailUtilisateur',
//     component: DetailUtilisateur
//   }
// ]
// import Campagnes from '../views/campagnes/CampagnesDashboard.vue'
// import CreateCampagne from '../views/campagnes/CreateCampagne.vue'
// import UpdateCampagne from '../views/campagnes/UpdateCampagne.vue'
// import DetailCampagne from '../views/campagnes/DetailCampagne.vue'
// import Login from '@/views/Login.vue'

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
      path: '/campagnes/update/:id',
      name: 'update-campagne',
      component: UpdateCampagne
    },
    {
      path: '/campagnes/detail/:id',
      name: 'detail-campagne',
      component: DetailCampagne
    },
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
  }
  ],
})

export default router