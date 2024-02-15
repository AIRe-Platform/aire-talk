import { reactive } from "vue";

export interface UIStateOptions {
    showMenu: boolean;
    showChatHistory: boolean;
    showContentCatalog: boolean;
}

export const UIState = reactive<UIStateOptions>({ 
    showMenu: true,
    showChatHistory: false,
    showContentCatalog: false
})
