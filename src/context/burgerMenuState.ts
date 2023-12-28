import { reactive } from "vue";

 export interface BurgerState
{
    isBurgerMenuOpen: boolean;
}

export const BurgerMenuState: BurgerState = reactive(initBurgerState());

function initBurgerState(): BurgerState
{
    return {
        isBurgerMenuOpen: false,
    }
}