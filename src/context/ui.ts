// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { computed, reactive, watch } from "vue";
import useLogin from "./login";

export enum UIPanels {
    ChatHistory = "chat-history",
    Settings = "settings",
    ContentCatalog = "content-catalog",
}

export enum UIFontSize {
    Normal = "font-normal",
    Large = "font-large",
}

export class UIContext {
    // State
    // =====
    private _showMenu: boolean = false;
    private _mobileLayout: boolean = false;
    private _panels = new Set<UIPanels>;

    // Settings
    // ========
    private _fontSize: UIFontSize;
    private _tokensEnabled: boolean;

    constructor() {
        this._fontSize = (localStorage.getItem("ui-font-size") || UIFontSize.Normal) as UIFontSize;
        this.setFontSize(this._fontSize);

        this._tokensEnabled = (localStorage.getItem("show-chat-tokens") === "true");

        const mediaQuery = this.mobileMediaQuery();
        this._mobileLayout = mediaQuery.matches;
        mediaQuery.addEventListener("change", (e: MediaQueryListEvent) => {
            console.debug("Layout change. Mobile layout: ", e.matches);
            UIState.setMobileLayout(e.matches);
        });
    }

    private mobileMediaQuery() {
        return window.matchMedia("screen and ((max-aspect-ratio: 1/1) or (max-width: 920px))");
    }

    public isMenuOpen() {
        return computed(() => this._showMenu);
    }

    public toggleMenu() {
        if (this._showMenu) {
            this.closeMenu();
        }
        else {
            this._showMenu = true;
        }
    }

    public openMenu() {
        this._showMenu = true;
    }

    public closeMenu() {
        this._showMenu = false;
        this.closePanels();
    }

    public isPanelOpen(panel: UIPanels) {
        return computed(() => this._panels.has(panel));
    }

    public openPanel(panel: UIPanels) {
        if (!this._panels.has(panel))
            this._panels.add(panel);
    }

    public closePanel(panel: UIPanels) {
        this._panels.delete(panel);
    }

    public closePanels() {
        this._panels.clear();
    }

    public openPanels() {
        return computed(() => [... this._panels]);
    }

    public mobileLayout() {
        return computed(() => this._mobileLayout);
    }

    public setMobileLayout(enabled: boolean) {
        this._mobileLayout = enabled;
    }

    public compressMenu() {
        return computed(() => this._mobileLayout && this._panels.size > 0);
    }

    public fontSize() {
        return computed(() => this._fontSize);
    }

    public showChatTokens() {
        return computed(() => this._tokensEnabled);
    }

    public setFontSize(size: UIFontSize) {
        document.documentElement.classList.remove(UIFontSize.Large, UIFontSize.Normal);
        document.documentElement.classList.add(size);
        localStorage.setItem("ui-font-size", size);
        this._fontSize = size;
    }

    public setChatTokensVisible(show: boolean) {
        localStorage.setItem("show-chat-tokens", show ? "true" : "false");
        this._tokensEnabled = show;
    }
}

export const isRestrictedMode = computed(() => !!(useLogin().session?.invite));
export const UIState = reactive(new UIContext());
