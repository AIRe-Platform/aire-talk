import { Login } from "@/context/login";
import { getUILanguage } from "@/locales";

export function getUserLanguageCode(): string {
    let lang = Login.user?.language;
    if (!lang || lang === "")
        lang = getUILanguage();
    return lang;
}
