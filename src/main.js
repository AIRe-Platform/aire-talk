import { createApp } from 'vue'
import { router } from './router.js'
import App from './App.vue'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info)
}

app.use(router).mount('#app')