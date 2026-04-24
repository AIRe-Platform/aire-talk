// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { computed, reactive } from "vue";

export type Style = "theme-default" | "theme-dark";

export class ThemeContext {
    private _style: Style;

    constructor() {
        this._style = (localStorage.getItem("theme-style") ?? this.getPreferredStyle()) as Style;
        this.applyStyle(this._style);
    }

    public style() {
        return computed(() => this._style);
    }

    public isDarkTheme() {
        return computed(() => this._style === "theme-dark");
    }

    public applyStyle(style: Style) {
        document.documentElement.classList.remove("theme-default", "theme-dark");
        localStorage.setItem("theme-style", style);
        document.documentElement.classList.add(style)
        this._style = style;
    }

    public getPreferredStyle(): Style {
        return window.matchMedia("(prefers-color-scheme: dark)") ? "theme-dark" : "theme-default";
    }
}

const context = reactive(new ThemeContext());
export default function useTheme() {
    return context;
}

