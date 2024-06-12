import { reactive, watch } from "vue";

export type Style = "theme-default" | "theme-dark";

export class ThemeContext {
    style: Style;

    constructor() {
        const defaultTheme: Style = window.matchMedia("(prefers-color-scheme: dark)") ? "theme-dark" : "theme-default";    
        this.style = (localStorage.getItem("theme-style") || defaultTheme) as Style;
        this.apply(this.style);
    }

    public apply(style: Style) {
        if (this.style) {
            document.documentElement.classList.remove(this.style);
            localStorage.setItem("theme-style", style);
        }
        document.documentElement.classList.add(style)
        this.style = style;
    }
}

const context = reactive<ThemeContext>(new ThemeContext());

export default function useTheme() {
    return context;
}

watch(
    () => context.style,
    (value) => {
        context.apply(value)
    },
    { deep: true }
);
