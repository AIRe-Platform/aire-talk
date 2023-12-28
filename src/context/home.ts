import { reactive } from "vue";

 export interface HomeState
{
    isBurgerMenuOpen: boolean;
}

export const Home: HomeState = reactive(initHometState());

function initHometState(): HomeState
{
    return {
        isBurgerMenuOpen: false,
    }
}