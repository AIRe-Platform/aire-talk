import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
import i18n from './locales'
import { initAire } from './services/aire'
import { restoreSession } from './context/login'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faThumbsDown, faThumbsUp, faCopy, faTrash, faEllipsisVertical, faXmark, faSliders } from '@fortawesome/free-solid-svg-icons'


/* add icons to the library */
library.add(faUserSecret, faThumbsDown, faThumbsUp, faCopy, faTrash, faEllipsisVertical, faXmark, faSliders )

initAire({
    api_url: "http://localhost:7071/api"
}).then(async (result) => {
    if(result)
    {
        restoreSession();
    }
});

const app = createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)


app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info)
}

app
    .use(router)
    .use(i18n)
    .mount('#app')
    