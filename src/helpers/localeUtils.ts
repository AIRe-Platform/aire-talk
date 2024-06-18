import useLogin from "@/context/login";
import { getUILanguage, supportedLocales } from "@/locales";
import { LanguageCode } from "iso-639-1";

export function getUserLanguageCode(): string {
    const login = useLogin();
    let lang = login.user?.language;
    if (!lang || lang === "")
        lang = getUILanguage();
    return lang;
}

export function getSystemLanguageCode(): string {
    const userLang = useLogin().user?.language;
    if(userLang && supportedLocales.includes(userLang as LanguageCode))
        return userLang;
    else
        return getUILanguage();
}
