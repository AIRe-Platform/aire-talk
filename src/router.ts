import { createRouter, createWebHistory } from 'vue-router'
import { initApp } from './main'
import { Login } from './context/login'

import HomeView from './views/Home.vue'
import LoginView from './views/Login.vue'
import SignupView from './views/Signup.vue'
import ProfileView from './views/Profile.vue'
import ChatView from './views/Chat.vue'
import LandingView from './views/Landing.vue'
import SettingsView from './views/Settings.vue'
import NotFoundView from './views/NotFound.vue'
import OnboardingView from './views/Onboarding.vue'
import VerificationCodeView from './views/VerificationCode.vue'
import { nextTick } from 'vue'
import i18n, { l } from './locales'

export const router = createRouter({
    history: createWebHistory(),
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
            path: '/onboarding', component: OnboardingView, 
            name: "Onboarding"
        },
        {
            path: '/settings', component: SettingsView, 
            name: "Settings", meta: { title: l.nav_preferences }
        },
        {
            path: '/verify', component: VerificationCodeView, 
            name: "VerificationCode", meta: { title: l.verification_heading }
        },
        {
            path: '/:pathMatch(.*)*', component: NotFoundView
        }
    ]
})

router.beforeEach(async (to, from) => {
    // Ensure app is initialized
    await initApp();

    if (to.path === "/login" || to.path === "/signup" || to.path === "/landing") {
        if (Login.logged_in)
            return "/"
    }
    else if (to.path === "/profile" || to.path === "/chat") {
        if (!Login.logged_in)
            return "/login"
        else if (!Login.verified)
            return "/verify"
    }
    else if (to.path === "/verify") {
        if (Login.verified || !Login.logged_in)
            return "/"
    }

    if (Login.logged_in && !Login.verified && to.path !== "/verify") {
        return "/verify"
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
