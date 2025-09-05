import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    },
    {
      path: '/pokemon',
      name: 'pokemon',
      component: () => import(/* webpackChunkName: "pokemon" */ '../views/Pokemon.vue'),
    },
    {
      path: '/pokemon/:id',
      name: 'pokemon-detail',
      component: () => import(/* webpackChunkName: "pokemon-detail" */ '../views/PokemonDetail.vue'),
    },
  ],
})

export default router
