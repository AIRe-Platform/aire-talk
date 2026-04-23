// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { createI18n } from 'vue-i18n';
import en from './en';
import fi from './fi';
import sv from './sv';
import es from './es';
import vi from './vi';
import id from './id';
import sw from './sw';
import rw from './rw';

import { LocalizationKey } from './keys';
import { LanguageCode } from 'iso-639-1';
import { computed } from 'vue';

export const l = LocalizationKey;
export type Locale = { [id in LocalizationKey]: string };

export const supportedLocales: LanguageCode[] = [
    "en", "fi", "sv", "es", "vi", "id", "sw", "rw"
]

const LANGUAGE_KEY = "locale";

const i18n = initLocale();
export default i18n;

function initLocale() {
    const storedLocale = getStoredLanguage();
    const browserLocale = getBrowserLanguage();
    const defaultLocale: LanguageCode = "en";

    let loc: LanguageCode | null = defaultLocale;
    if (storedLocale) {
        loc = storedLocale;
    }
    else if (browserLocale) {
        loc = browserLocale;
        setLanguageSetting(loc);
    }

    document.documentElement.lang = loc;

    return createI18n({
        locale: loc,
        legacy: false,
        messages: {
            en: { ...en },
            fi: { ...fi },
            sv: { ...sv },
            es: { ...es },
            id: { ...id },
            sw: { ...sw },
            rw: { ...rw },
            vi: { ...vi }
        },
        fallbackLocale: defaultLocale,
        availableLocales: supportedLocales,
    });
}

export function setUILanguage(lang: LanguageCode) {
    if (!supportedLocales.includes(lang))
        return;

    document.documentElement.lang = lang;

    const loc = i18n.global.locale as any;
    loc.value = lang;

    setLanguageSetting(lang);
}

export function getUILanguage() {
    return computed(() => {
        const loc = i18n.global.locale as any;
        return loc.value as LanguageCode;
    })
}

export function hasSelectedLanguage() {
    return localStorage.getItem(LANGUAGE_KEY) != null;
}

function getStoredLanguage() {
    return localStorage.getItem(LANGUAGE_KEY) as LanguageCode | null;
}

function setLanguageSetting(lang: LanguageCode) {
    localStorage.setItem(LANGUAGE_KEY, lang);
}

function getBrowserLanguage() {
    if (navigator.language.length < 2)
        return null;

    const lang = navigator.language.substring(0, 2) as LanguageCode;
    if (supportedLocales.includes(lang))
        return lang;
    else
        return null;
}
