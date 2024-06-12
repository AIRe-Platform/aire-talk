import useLogin from "@/context/login";
import { getUILanguage } from "@/locales";

export function getUserLanguageCode(): string {
    const login = useLogin();
    let lang = login.user?.language;
    if (!lang || lang === "")
        lang = getUILanguage();
    return lang;
}
