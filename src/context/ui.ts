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
}

export interface UIStateOptions {
    showMenu: boolean;
    isNavMenuCompressed: boolean;
    isClosingMenu: boolean;
    panels: Set<UIPanels>;
}

export const UIState = reactive<UIStateOptions>({
    showMenu: false,
    isNavMenuCompressed: false,
    isClosingMenu: false,
    panels: new Set<UIPanels>(),
});

export const UISettings = reactive<UISettingsOptions>(initSettings());

function initSettings(): UISettingsOptions {
    const options: UISettingsOptions = {
        fontSize: (localStorage.getItem("ui-font-size") ||
            UIFontSize.Normal) as UIFontSize
    };
    applyFontSize(options.fontSize);
    return options;
}

function applyFontSize(newSize: UIFontSize, oldSize?: UIFontSize) {
    if (oldSize) {
        document.documentElement.classList.remove(oldSize);
        localStorage.setItem("ui-font-size", newSize);
    }
    document.documentElement.classList.add(newSize);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function closeBurgerMenu(){
    if (UIState.showMenu) {
        UIState.isClosingMenu = true;
        await sleep(500);
        UIState.isClosingMenu = false;
    }
}

watch(
    () => UISettings.fontSize,
    (newValue, oldValue) => {
        applyFontSize(newValue, oldValue);
    },
    { deep: true }
);
