import { createRouter, createWebHashHistory } from 'vue-router'
import CheckSetupView from '../views/CheckSetupView.vue'
import SetupView from '../views/SetupView.vue'
import LoginView from '../views/LoginView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import VaultView from '../views/VaultView.vue'

let isAuthenticated = false

export function setAuthenticated(value) {
  isAuthenticated = value
}

const routes = [
  { path: '/', redirect: '/check' },
  { path: '/check', component: CheckSetupView },
  { path: '/setup', component: SetupView },
  { path: '/login', component: LoginView },
  { path: '/welcome', component: WelcomeView },
  {
    path: '/vault',
    component: VaultView,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated) {
        next()
      } else {
        next('/login')
      }
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
