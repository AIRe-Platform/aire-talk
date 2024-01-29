import { createI18n } from 'vue-i18n'
import en from './en'
import fi from './fi'
import es from './es'

import { LocalizationKey } from './keys';

export const l = LocalizationKey;
export type Locale = { [id in LocalizationKey]: string };
export type Lang = "en" | "fi" | "es";

export const supportedLocales = [
    { lang: "en", name: "English" },
    { lang: "fi", name: "suomi (Finnish)" },
    { lang: "es", name: "Español (Spanish)" }
]

const i18n = createI18n(initLocale());
export default i18n;

function initLocale() {
    const storedLocale = localStorage.getItem("locale");
    const defaultLocale: Lang = "en";

    const loc = storedLocale ?? defaultLocale;
    document.documentElement.lang = loc;

    return {
        locale: loc,
        legacy: false,
        messages: {
            en: { ...en },
            fi: { ...fi },
            es: { ...es }
        }
    }
}

export function setLocale(lang: Lang) {
    document.documentElement.lang = lang;

    // Is a ref in non-legacy mode
    const loc = i18n.global.locale as any;
    loc.value = lang;

    localStorage.setItem("locale", lang);
}
