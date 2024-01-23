import { ref } from "vue";

export interface UIStateOptions {
    isBurgerMenuEnabled: boolean
}

export const UIState = ref<UIStateOptions>({ isBurgerMenuEnabled: false })
