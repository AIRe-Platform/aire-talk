import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/Home.vue'
import LoginView from './views/Login.vue'
import SignupView from './views/Signup.vue'
import ProfileView from './views/Profile.vue'
import ChatView from './views/Chat.vue'
import LandingView from './views/Landing.vue'
import CheckBoxView from './views/CheckBox.vue'
import SettingsView from './views/Settings.vue'
import NotFoundView from './views/NotFound.vue'
import { Login } from './context/login'
import VerificationCodeView from './views/VerificationCode.vue'
import { initApp } from './main'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView, name: "Home", props: true },
        { path: '/login', component: LoginView, name: "Login" },
        { path: '/signup', component: SignupView, name: "Signup" },
        { path: '/profile', component: ProfileView, name: "Profile" },
        { path: '/chat', component: ChatView, name: "Chat", props: true },
        { path: '/landing', component: LandingView, name: "Landing" },
        { path: '/checkBox', component: CheckBoxView, name: "CheckBox" },
        { path: '/settings', component: SettingsView, name: "Settings" },
        { path: '/verify', component: VerificationCodeView, name: "VerificationCode" },
        { path: '/:pathMatch(.*)*', component: NotFoundView }
    ]
})

router.beforeEach(async (to, from) => {
    // Ensure app is initialized
    await initApp();

    if (to.path === "/login" || to.path === "/signup") {
        if (Login.logged_in)
            return "/"
    }
    else if (to.path === "/profile") {
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
