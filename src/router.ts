import { createRouter, createWebHistory } from 'vue-router'
import { initApp } from './main'
import { Login } from './context/login'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import SignupView from './views/SignupView.vue'
import ProfileView from './views/ProfileView.vue'
import ChatView from './views/ChatView.vue'
import LandingView from './views/LandingView.vue'
import NotFoundView from './views/NotFoundView.vue'
import VerificationView from './views/VerificationView.vue'
import { nextTick } from 'vue'
import i18n, { l } from './locales'

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/', component: HomeView,
            name: "Home", meta: { title: l.nav_home }
        },
        {
            path: '/login', component: LoginView,
            name: "Login", meta: { title: l.nav_login }
        },
        {
            path: '/signup', component: SignupView,
            name: "Signup", meta: { title: l.nav_signup }
        },
        {
            path: '/profile', component: ProfileView,
            name: "Profile", meta: { title: l.nav_profile }
        },
        {
            path: '/chat', component: ChatView,
            name: "Chat", meta: { title: l.nav_chat }
        },
        {
            path: '/landing', component: LandingView,
            name: "Landing"
        },
        {
            path: '/verify', component: VerificationView,
            name: "VerificationCode", meta: { title: l.verification_heading }
        },
        {
            path: '/:pathMatch(.*)*', component: NotFoundView
        }
    ]
})

router.beforeEach(async (to, from) => {
    await initApp();

    if (Login.logged_in && !Login.verified && to.path !== "/verify") {
        return "/verify";
    }

    if (to.path === "/login" || to.path === "/signup" || to.path === "/landing") {
        if (Login.logged_in)
            return "/"
    }

    if (to.path === "/profile" || to.path === "/chat" || to.path === "/verify") {
        if (!Login.logged_in)
            return "/login"
    }
});

router.afterEach((to, from) => {
    nextTick(() => {
        let title = "AIRe Talk"
        if (to.meta && typeof to.meta.title === 'string')
            title += " | " + i18n.global.t(to.meta.title)
        document.title = title
    })
});
