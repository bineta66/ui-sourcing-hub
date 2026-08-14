import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Inscription from '../views/Inscription.vue'
import MotDePasseOublie from '../views/MotDePasseOublie.vue'
import CreationUtilisateur from '../views/CreationUtilisateur.vue'
import GestionUtilisateurs from '../views/GestionUtilisateurs.vue'
import DetailUtilisateur from '../views/DetailUtilisateur.vue'

const routes = [
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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router