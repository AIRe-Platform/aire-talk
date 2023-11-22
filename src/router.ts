import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/Home.vue'
import LoginView from './views/Login.vue'
import SignupView from './views/Signup.vue'
import PreferencesView from './views/Preferences.vue'
import ChatView from './views/Chat.vue'
import NotFoundView from './views/NotFound.vue'
import { Login } from './context/login'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView, name: "Home" },
        { path: '/login', component: LoginView, name: "Login" },
        { path: '/signup', component: SignupView, name: "Signup" },
        { path: '/preferences', component: PreferencesView, name: "Preferences" },
        { path: '/chat', component: ChatView, name: "Chat" },
        
        { path: '/:pathMatch(.*)*', component: NotFoundView }
    ]
})

router.beforeEach(async (to, from) => {
    if(Login.logged_in)
    {
        if(to.name == "Login" || to.name == "Signup")
            return "/"
    }
    else
    {
        if(to.name == "Preferences")
            return "/login"
    }
});
