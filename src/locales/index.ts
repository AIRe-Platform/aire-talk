import { createI18n } from 'vue-i18n'
import en from './en'
import fi from './fi'

export interface Locale {
    title: string;
    footer: string;
    not_found: string;

    aire_bot: string;
    aire_system: string;
    system_greeting: string;

    chat_link_button_label: string;

    error_generic: string;
    error_ai_not_responding: string;
}

export const supportedLocales = {
    "en": { name: "English" },
    "fi": { name: "suomi (Finnish)" }
}

export default createI18n({
    locale: "en",
    messages: {
        en: { ...en },
        fi: { ...fi }
    }
})
