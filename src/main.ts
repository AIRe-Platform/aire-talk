import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
import i18n from './locales'
import { initAire } from './services/aire'
import { initOllama } from './services/ollama'

initAire({
    api_url: "http://localhost:7071",
    api_key: "asdf"
})

initOllama({
    host: "http://localhost:11434/api/generate",
    model: "openhermes2-mistral",
    system: `
        Act as a doctor.
        Your task is to find out what is bothering your patient and provide suggestions.
        Do not suggest anything that could worsen the condition of the patient.
    `,
    stream: true
})

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info)
}

app
    .use(router)
    .use(i18n)
    .mount('#app')
    