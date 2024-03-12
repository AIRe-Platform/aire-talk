import { reactive, watch } from "vue";

export enum UIPanels {
    ChatHistory = "chat-history",
    Settings = "settings",
    ContentCatalog = "content-catalog"
}

export enum UIFontSize {
    Normal = "font-normal",
    Large = "font-large"
}

export interface UISettingsOptions {
    fontSize: UIFontSize;
}

export interface UIStateOptions {
    showMenu: boolean;
    panels: Set<UIPanels>;
}

export const UIState = reactive<UIStateOptions>({
    showMenu: false,
    panels: new Set<UIPanels>
})

export const UISettings = reactive<UISettingsOptions>(initSettings())

function initSettings(): UISettingsOptions {
    const options: UISettingsOptions = {
        fontSize: (localStorage.getItem("ui-font-size") || UIFontSize.Normal) as UIFontSize
    }
    applyFontSize(options.fontSize)
    return options
}

function applyFontSize(newSize: UIFontSize, oldSize?: UIFontSize) {
    if (oldSize) {
        document.documentElement.classList.remove(oldSize)
        localStorage.setItem("ui-font-size", newSize);
    }
    document.documentElement.classList.add(newSize)
}

watch(
    () => UISettings.fontSize,
    (newValue, oldValue) => {
        applyFontSize(newValue, oldValue)
    },
    { deep: true }
)
