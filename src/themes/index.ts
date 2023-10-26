import { reactive } from "vue";

export interface Theme
{
    style: "default" | "dark";
}

const config: Theme = {
    style: "dark"
}

function initTheme() : Theme
{
    const darkModeRequested = window.matchMedia("(prefers-color-scheme: dark)");
    if(darkModeRequested)
        return { style: "dark" }
    else
        return { style: "default" }
}

export const theme = reactive(initTheme());
