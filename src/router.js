import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/Home.vue'
import LoginView from './views/Login.vue'
import RegisterView from './views/Register.vue'
import PreferencesView from './views/Preferences.vue'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/login', component: LoginView },
        { path: '/register', component: RegisterView },
        { path: '/preferences', component: PreferencesView }
    ]
})
