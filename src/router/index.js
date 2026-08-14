import { createRouter, createWebHistory } from 'vue-router'
import Campagnes from '../views/campagnes/CampagnesDashboard.vue'
import CreateCampagne from '../views/campagnes/CreateCampagne.vue'
import UpdateCampagne from '../views/campagnes/UpdateCampagne.vue'
import DetailCampagne from '../views/campagnes/DetailCampagne.vue'
import Login from '@/views/Login.vue'

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
      path: '/campagnes/update/',
      name: 'update-campagne',
      component: UpdateCampagne
    },
    {
      path: '/campagnes/detail/',
      name: 'detail-campagne',
      component: DetailCampagne
    },
  ],
})

export default router