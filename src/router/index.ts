import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '@/views/GameView.vue'
import EncryptView from '@/views/EncryptView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/encryption',
      name: 'encryption',
      component: EncryptView
    },
    {
      path: '/Game',
      name: 'Game',
      component: GameView
    }
  ]
})

export default router
