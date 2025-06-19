// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { reactive, watch } from "vue";

export enum UIPanels {
    ChatHistory = "chat-history",
    Settings = "settings",
    ContentCatalog = "content-catalog",
}

export enum UIFontSize {
    Normal = "font-normal",
    Large = "font-large",
}

export interface UISettingsOptions {
    fontSize: UIFontSize;
    ttsEnabled: boolean;
    tokensEnabled: boolean;
}

export interface UIStateOptions {
    showMenu: boolean;
    isNavMenuCompressed: boolean;
    isClosingMenu: boolean;
    panels: Set<UIPanels>;
    chatHistoryButtonRef: HTMLElement | null;
    settingsButtonRef: HTMLElement | null;
    reminderModalRef: HTMLElement | null;
}

export const UIState = reactive<UIStateOptions>({
    showMenu: false,
    isNavMenuCompressed: false,
    isClosingMenu: false,
    panels: new Set<UIPanels>(),
    chatHistoryButtonRef: document.querySelector('.chat-history-nav-button') || null,
    settingsButtonRef: document.querySelector('.settings-nav-button') || null,
    reminderModalRef: null,
});

export const UISettings = reactive<UISettingsOptions>(initSettings());

function initSettings(): UISettingsOptions {
    const options: UISettingsOptions = {
        fontSize: (localStorage.getItem("ui-font-size") || UIFontSize.Normal) as UIFontSize,
        ttsEnabled: (localStorage.getItem("tts-enabled") === "true"),
        tokensEnabled: (localStorage.getItem("tokens-enabled") === "true"),
    };
    applyFontSize(options.fontSize);
    return options;
}

function applyFontSize(size: UIFontSize) {
    document.documentElement.classList.remove(UIFontSize.Large, UIFontSize.Normal);
    document.documentElement.classList.add(size);
    localStorage.setItem("ui-font-size", size);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function refreshBurgerMenuButtonsRef() {
    UIState.chatHistoryButtonRef = document.querySelector('.chat-history-nav-button') || null;
    UIState.settingsButtonRef = document.querySelector('.settings-nav-button') || null;
}

export async function closeBurgerMenu() {
    if (UIState.showMenu) {
        UIState.isClosingMenu = true;
        await sleep(500);
        UIState.isClosingMenu = false;
    }
}

watch(UISettings,
    (newSettings, _) => {
        applyFontSize(newSettings.fontSize);
        localStorage.setItem("tts-enabled", newSettings.ttsEnabled ? "true" : "false");
        localStorage.setItem("tokens-enabled", newSettings.tokensEnabled ? "true" : "false");
    },
    { deep: true }
);
