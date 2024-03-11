import { reactive, watch } from "vue";

export type Style = "theme-default" | "theme-dark";

export interface ThemeConfig {
    style: Style;
}

export const Theme = reactive<ThemeConfig>(initTheme());

function initTheme(): ThemeConfig {
    const defaultTheme: Style = window.matchMedia("(prefers-color-scheme: dark)") ? "theme-dark" : "theme-default";
    const theme: ThemeConfig = {
        style: (localStorage.getItem("theme-style") || defaultTheme) as Style
    }
    applyStyle(theme.style);
    return theme;
}


function applyStyle(newStyle: Style, oldStyle?: Style) {
    if (oldStyle) {
        document.documentElement.classList.remove(oldStyle);
        localStorage.setItem("theme-style", newStyle);
    }
    document.documentElement.classList.add(newStyle)
}

watch(
    () => Theme.style,
    (newValue, oldValue) => {
        applyStyle(newValue, oldValue)
    },
    { deep: true }
);
