import { createRouter, createWebHistory } from 'vue-router'
import CheckoutConfirmation from '../views/CheckoutConfirmation.vue'
import CheckoutPage from '../views/CheckoutPage.vue'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/producto/:slug',
    name: 'product-detail',
    component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage
  },
  {
    path: '/checkout/confirmacion',
    name: 'checkout-confirmation',
    component: CheckoutConfirmation
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router