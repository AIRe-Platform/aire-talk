import { reactive } from "vue";

export interface UIStateOptions {
    isBurgerMenuEnabled: boolean;
    isSummaryOpen: boolean;
}

export const UIState = reactive<UIStateOptions>({ 
    isBurgerMenuEnabled: false,
    isSummaryOpen: false
})
