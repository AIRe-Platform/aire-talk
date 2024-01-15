import { createApp, ref } from 'vue'
import { router } from './router'
import App from './App.vue'
import i18n from './locales'
import { initAire } from './lib/aire'
import { restoreSession } from './context/login'


/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faThumbsDown, faThumbsUp, faCopy, faTrash, faEllipsisVertical, faXmark, faSliders } from '@fortawesome/free-solid-svg-icons'


/* add icons to the library */
library.add(faUserSecret, faThumbsDown, faThumbsUp, faCopy, faTrash, faEllipsisVertical, faXmark, faSliders )


export const AppState = ref<"init" | "loaded" | "error">("init");

export async function initApp()
{
    if(AppState.value !== "init")
        return;

    /* const result = await initAire({
        api_url: (process.env.NODE_ENV === "production" 
            ? "https://gl-dev-aire.azure-api.net/services/" 
            : "http://localhost:7071/api"
        )
    } */
    const result = await initAire({
        api_url: "https://gl-dev-aire.azure-api.net/services/"
    }).then(async (result) => {
        if(result)
        {
            await restoreSession();
            return true
        }
        return false;
    }).catch(reason => {
        console.error(reason);
        return false
    })

    AppState.value = result ? "loaded" : "error"
    console.debug("App init done")
}

const app = createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)


app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info)
}

app
    .use(i18n)
    .use(router)
    .mount('#app')
    