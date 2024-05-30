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

export enum UIMode {
    Mobile = "ui-mode-mobile",
    Desktop = "ui-mode-desktop",
}

export interface UISettingsOptions {
    fontSize: UIFontSize;
    uiMode: UIMode;
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
        uiMode: (localStorage.getItem("ui-mode") ||
            UIMode.Desktop) as UIMode,
    };
    applyFontSize(options.fontSize);
    applyUiMode(options.uiMode);
    return options;
}

function applyFontSize(newSize: UIFontSize, oldSize?: UIFontSize) {
    if (oldSize) {
        // console.log("document.documentElement", document.documentElement);
        document.documentElement.classList.remove(oldSize);
        localStorage.setItem("ui-font-size", newSize);
    }
    document.documentElement.classList.add(newSize);
}

function applyUiMode(newMode: UIMode, oldMode?: UIMode) {
    if (oldMode) {
        document.documentElement.classList.remove(oldMode);
        localStorage.setItem("ui-mode", newMode);
    }
    document.documentElement.classList.add(newMode);
}
watch(
    () => UISettings.fontSize,
    (newValue, oldValue) => {
        applyFontSize(newValue, oldValue);
    },
    { deep: true }
);

watch(
    () => UISettings.uiMode,
    (newValue, oldValue) => {
        applyUiMode(newValue, oldValue);
    },
    { deep: true }
);
