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

    login_form_title: string;
    login_form_submit: string;
    login_label_email: string;
    login_label_password: string;
    login_failure_message: string;

    signup_form_title: string;
    signup_form_submit: string;
    signup_label_email: string;
    signup_label_password: string;
    signup_label_confirm_password: string;
    signup_failure_message: string;

    nav_login: string;
    nav_logout: string;
    nav_signup: string;
    nav_theme: string;

    error_generic: string;
    error_ai_not_responding: string;
}

export type Lang = "en" | "fi";

export const supportedLocales = [
    { lang: "en", name: "English" },
    { lang: "fi", name: "suomi (Finnish)" }
]

const i18n = createI18n(initLocale());
export default i18n;

function initLocale()
{
    const storedLocale = localStorage.getItem("locale");
    const defaultLocale: Lang = "en";

    const loc = storedLocale ?? defaultLocale;
    document.documentElement.lang = loc;

    return {
        locale: loc,
        messages: {
            en: { ...en },
            fi: { ...fi }
        }
    }
}

export function setLocale(lang: Lang)
{
    document.documentElement.lang = lang;
    i18n.global.locale = lang;
    localStorage.setItem("locale", lang);
}
