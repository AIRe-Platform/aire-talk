import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
import i18n from './locales'
import { initAire } from './services/aire'

initAire({
    api_url: "http://localhost:7071/api",
    api_key: "asdf"
})

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info)
}

app
    .use(router)
    .use(i18n)
    .mount('#app')
    