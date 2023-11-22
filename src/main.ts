import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
import i18n from './locales'
import { Services, initAire } from './services/aire'
import { Login } from './context/login'

initAire({
    api_url: "http://localhost:7071/api",
    api_key: "asdf"
}).then(async (result) => {
    if(result)
    {
        if(Services.ID)
        {
            Login.logged_in = await Services.ID.restoreSession();
        }
    }
});

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info)
}

app
    .use(router)
    .use(i18n)
    .mount('#app')
    