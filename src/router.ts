import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/Home.vue'
import LoginView from './views/Login.vue'
import SignupView from './views/Signup.vue'
import ProfileView from './views/Profile.vue'
import ChatView from './views/Chat.vue'
import NotFoundView from './views/NotFound.vue'
import { Login } from './context/login'
import { initApp } from './main'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView, name: "Home" },
        { path: '/login', component: LoginView, name: "Login" },
        { path: '/signup', component: SignupView, name: "Signup" },
        { path: '/profile', component: ProfileView, name: "Profile" },
        { path: '/chat', component: ChatView, name: "Chat" },
        
        { path: '/:pathMatch(.*)*', component: NotFoundView }
    ]
})

router.beforeEach(async (to, from) => {
    // Ensure app is initialized
    await initApp();

    if(to.path === "/login" || to.path === "/signup")
    {
        if(Login.logged_in)
            return "/"
    }
    else if (to.path === "/profile")
    {
        if(!Login.logged_in) 
            return "/login"
    }
});
