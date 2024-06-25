import useMobileLayout from "@/helpers/mobile";
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
    Dynamic = "ui-mode-dynamic",
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
        document.documentElement.classList.remove(oldSize);
        localStorage.setItem("ui-font-size", newSize);
    }
    document.documentElement.classList.add(newSize);
}

export function setUIModeLayoutBeforeMount(){
    applyUiClass(useMobileLayout.value ? UIMode.Mobile : UIMode.Desktop);
}

export function applyUiClass(mode: UIMode) {
    document.documentElement.classList.remove(UIMode.Desktop);
    document.documentElement.classList.remove(UIMode.Mobile);
    if(mode !== UIMode.Dynamic)
        document.documentElement.classList.add(mode);
}

function applyUiMode(newMode: UIMode, oldMode?: UIMode) {
    localStorage.setItem("ui-mode", newMode);
    applyUiClass(newMode)
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
