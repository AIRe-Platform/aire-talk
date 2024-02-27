import { createI18n } from 'vue-i18n'
import en from './en'
import fi from './fi'
import es from './es'
import vi from './vi'
import { LocalizationKey } from './keys';
import { LanguageCode } from 'iso-639-1'

export const l = LocalizationKey;
export type Locale = { [id in LocalizationKey]: string };

export const supportedLocales: LanguageCode[] = [
    "en", "fi", "es", "vi"
]

const i18n = createI18n(initLocale());
export default i18n;

function initLocale() {
    const storedLocale = localStorage.getItem("locale");
    const defaultLocale: LanguageCode = "en";

    const loc = storedLocale ?? defaultLocale;
    document.documentElement.lang = loc;

    return {
        locale: loc,
        legacy: false,
        messages: {
            en: { ...en },
            fi: { ...fi },
            es: { ...es },
            vi: { ...vi }
        }
    }
}

export function setLocale(lang: LanguageCode) {
    if(!supportedLocales.includes(lang))
        return;
    
    document.documentElement.lang = lang;

    // Is a ref in non-legacy mode
    const loc = i18n.global.locale as any;
    loc.value = lang;

    localStorage.setItem("locale", lang);
}

export function getLocale() {
    const loc = i18n.global.locale as any;
    return loc.value as string;
}
