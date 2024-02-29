import { reactive } from "vue";

export enum UIPanels {
    ChatHistory = "chat-history",
    Settings = "settings",
    ContentCatalog = "content-catalog"
}

export interface UIStateOptions {
    showMenu: boolean;
    panels: Set<UIPanels>;
}

export const UIState = reactive<UIStateOptions>({ 
    showMenu: true,
    panels: new Set<UIPanels>
})
