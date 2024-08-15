import { createRouter, createWebHistory } from "vue-router";
import { initApp } from "./main";
import StartView from "./views/StartView.vue";
import HomeView from "./views/HomeView.vue";
import LoginView from "./views/LoginView.vue";
import SignupView from "./views/SignupView.vue";
import ProfileView from "./views/ProfileView.vue";
import ChatView from "./views/ChatView.vue";
import LandingView from "./views/LandingView.vue";
import NotFoundView from "./views/NotFoundView.vue";
import AuthorizationCallbackView from "./views/AuthorizationCallbackView.vue";
import { nextTick } from "vue";
import i18n, { l } from "./locales";
import ContentCatalogueView from "./views/ContentCatalogueView.vue";
import useLogin from "./context/login";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: StartView,
            name: "Start",
            meta: {
                title: l.nav_start,
                no_login: true
            },
        },
        {
            path: "/home",
            component: HomeView,
            name: "Home",
            meta: {
                title: l.nav_home,
                require_login: true
            },
        },
        {
            path: "/content-catalogue",
            component: ContentCatalogueView,
            name: "Content Catalogue",
            meta: {
                title: l.nav_catalogue,
                require_login: true
            },
        },
        {
            path: "/login",
            component: LoginView,
            name: "Login",
            meta: {
                title: l.nav_login,
                no_login: true
            },
        },
        {
            path: "/signup",
            component: SignupView,
            name: "Signup",
            meta: {
                title: l.nav_signup,
                no_login: true
            },
        },
        {
            path: "/profile",
            component: ProfileView,
            name: "Profile",
            meta: {
                title: l.nav_profile,
                require_login: true
            },
        },
        {
            path: "/chat",
            component: ChatView,
            name: "Chat",
            meta: {
                title: l.nav_chat,
                require_login: true
            },
        },
        {
            path: "/landing",
            component: LandingView,
            name: "Landing",
        },
        {
            path: "/auth/callback",
            component: AuthorizationCallbackView,
            name: "AuthorizationCallback",
            meta: {
                title: l.nav_login
            }
        },
        {
            path: "/:pathMatch(.*)*",
            component: NotFoundView,
        },
    ],
});

router.beforeEach(async (to, from) => {
    await initApp();
    const login = useLogin();

    if (login.user) {
        if (to.meta.no_login)
            return "/home"
    }
    else {
        if (to.meta.require_login)
            return "/login"
    }
});

router.afterEach((to, from) => {
    nextTick(() => {
        let title = "AIRe Talk";
        if (to.meta && typeof to.meta.title === "string")
            title += " | " + i18n.global.t(to.meta.title);
        document.title = title;
    });
});
