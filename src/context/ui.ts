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

export enum UIScreenSize {
    Mobile = "mobile-screen",
    Tablet = "tablet-screen",
    Descktop = "descktop-screen",
}

export interface UISettingsOptions {
    fontSize: UIFontSize;
    screenSize: UIScreenSize;
}

export interface UIStateOptions {
    showMenu: boolean;
    isNavMenuCompressed: boolean;
    panels: Set<UIPanels>;
}

export const UIState = reactive<UIStateOptions>({
    showMenu: false,
    isNavMenuCompressed: false,
    panels: new Set<UIPanels>(),
});

export const UISettings = reactive<UISettingsOptions>(initSettings());

function initSettings(): UISettingsOptions {
    const options: UISettingsOptions = {
        fontSize: (localStorage.getItem("ui-font-size") ||
            UIFontSize.Normal) as UIFontSize,
        screenSize: (localStorage.getItem("ui-screen-size") ||
            UIScreenSize.Descktop) as UIScreenSize,
    };
    applyFontSize(options.fontSize);
    applyScreeSize(options.screenSize);
    return options;
}

function applyFontSize(newSize: UIFontSize, oldSize?: UIFontSize) {
    if (oldSize) {
        console.log("document.documentElement", document.documentElement);
        document.documentElement.classList.remove(oldSize);
        localStorage.setItem("ui-font-size", newSize);
    }
    document.documentElement.classList.add(newSize);
}

function applyScreeSize(newSize: UIScreenSize, oldSize?: UIScreenSize) {
    if (oldSize) {
        document.documentElement.classList.remove(oldSize);
        localStorage.setItem("ui-screen-size", newSize);
    }
    document.documentElement.classList.add(newSize);
}
watch(
    () => UISettings.fontSize,
    (newValue, oldValue) => {
        applyFontSize(newValue, oldValue);
    },
    { deep: true }
);

watch(
    () => UISettings.screenSize,
    (newValue, oldValue) => {
        applyScreeSize(newValue, oldValue);
    },
    { deep: true }
);
