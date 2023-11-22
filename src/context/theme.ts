import { reactive } from "vue";

export type Style = "theme-default" | "theme-dark";

export interface ThemeConfig
{
    style: Style;
}

function initTheme()
{
    const saved = localStorage.getItem("theme-style");
    if(saved != null)
    {
        setTheme(saved as Style);
        return;
    }

    const darkModeRequested = window.matchMedia("(prefers-color-scheme: dark)");
    if(darkModeRequested)
        setTheme("theme-dark");
    else
        setTheme("theme-default");
}

export function setTheme(style: Style)
{
    Theme.style = style;
    localStorage.setItem("theme-style", style);
    document.documentElement.className = style;
}

export const Theme: ThemeConfig = reactive({
    style: "theme-default"
});

initTheme();