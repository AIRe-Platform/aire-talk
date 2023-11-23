import { createI18n } from 'vue-i18n'
import en from './en'
import fi from './fi'

enum Strings
{
    title = "title",
    footer = "footer",
    not_found = "not_found",

    aire_bot = "aire_bot",
    aire_system = "aire_system",
    system_greeting = "system_greeting",

    chat_link_button_label = "chat_link_button_label",

    login_form_title = "login_form_title",
    login_form_submit = "login_form_submit",
    login_label_email = "login_label_email",
    login_label_password = "login_label_password",
    login_failure_message = "login_failure_message",

    signup_form_title = "signup_form_title",
    signup_form_submit = "signup_form_submit",
    signup_label_email = "signup_label_email",
    signup_label_password = "signup_label_password",
    signup_label_confirm_password = "signup_label_confirm_password",

    nav_chat = "nav_chat",
    nav_profile = "nav_profile",
    nav_login = "nav_login",
    nav_logout = "nav_logout",
    nav_signup = "nav_signup",
    nav_theme = "nav_theme",

    error_generic = "error_generic",
    error_ai_not_responding = "error_ai_not_responding",
    error_signup_password_mismatch = "error_signup_password_mismatch",
    error_signup_bad_request = "error_signup_bad_request",
    error_signup_general = "error_signup_general"
}

export const l = Strings;
export type Locale = { [id in Strings]: string };
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
        legacy: false,
        messages: {
            en: { ...en },
            fi: { ...fi }
        }
    }
}

export function setLocale(lang: Lang)
{
    document.documentElement.lang = lang;

    const loc = i18n.global.locale as any;
    loc.value  = lang;

    localStorage.setItem("locale", lang);
}
