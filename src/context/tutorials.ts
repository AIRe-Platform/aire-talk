import { reactive } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { UIState } from "./ui";
import useLogin from "./login";

const login = useLogin();

export interface TutorialPosition {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

type TutorialTrianglePosition = 'bottom-middle' | 'bottom-right' | 'bottom-left' | 'left-middle' | 'left-top' | 'right-bottom';

export interface ITutorial<T> {
    state: T[keyof T];
    position: TutorialPosition | null;
    trianglePosition: TutorialTrianglePosition;

    calculatePosition(elRect: DOMRect, popupRect: DOMRect): void;
    next(): void;
    skip(): void;
    isDone(): boolean;
    isVisible(route: RouteLocationNormalizedLoaded): boolean;
    shouldShow(route: RouteLocationNormalizedLoaded): boolean;
    isLastState(): boolean;
    tryGetState(): void;
}

export enum HomeTutorialState {
    Done = 'done',
    Welcome = 'home_welcome',
    StartChat = 'start_chat',
    Menu = 'menu',
}

export enum NavMenuTutorialState {
    Done = 'done',
    History = 'history',
    Profile = 'profile',
    Settings = 'settings',
}

export enum ChatTutorialState {
    Done = 'done',
    Welcome = 'chat_welcome',
    Input = 'input',
    Sidepanel = 'sidepanel',
}

abstract class TutorialBase<T extends Record<string, string>> {
    abstract state: T[keyof T];
    protected abstract storageKeyPrefix: string

    protected setLocalStorage(): void {
        localStorage.setItem(this.getStorageKey(), this.state);
    }

    protected getStorageKey(): string {
        return `${this.storageKeyPrefix}-${login.user?.uuid}`
    }
}

class HomeTutorial extends TutorialBase<typeof HomeTutorialState> implements ITutorial<HomeTutorialState> {
    storageKeyPrefix: string = 'home-tutorial-state';
    state: HomeTutorialState = HomeTutorialState.Welcome;
    position: TutorialPosition | null = null;
    trianglePosition: TutorialTrianglePosition = 'bottom-right';

    isVisible(route: RouteLocationNormalizedLoaded): boolean {
        return this.position !== null && this.shouldShow(route);
    }

    shouldShow(route: RouteLocationNormalizedLoaded): boolean {
        return route.matched.some((p) => p.name === 'Home') &&
            (!UIState.showMenu || UIState.isClosingMenu);
    }

    calculatePosition(elRect: DOMRect, popupRect: DOMRect): void {
        const mediaQuery = window.matchMedia('(max-aspect-ratio: 1/1), (max-width: 576px)');
        switch (this.state) {
            case HomeTutorialState.Welcome:
                this.trianglePosition = mediaQuery.matches ? 'bottom-middle' : 'bottom-right';
                this.position = {
                    top: elRect.top - popupRect.height - (mediaQuery.matches ? 16 : 32),
                    right: mediaQuery.matches ? window.innerWidth / 2 - popupRect.width / 2 : elRect.left
                };
                break;
            case HomeTutorialState.StartChat:
                this.trianglePosition = mediaQuery.matches ? 'bottom-middle' : 'left-middle';
                this.position = {
                    top: elRect.top - (mediaQuery.matches ? popupRect.height + 16 : 8),
                    left: mediaQuery.matches ? elRect.left + elRect.width / 2 - popupRect.width / 2 : elRect.right
                }
                break;
            case HomeTutorialState.Menu:
                this.trianglePosition = 'left-top';
                this.position = {
                    top: elRect.top,
                    left: elRect.right + 16
                }
                break;
            default:
                this.position = null;
                break;
        }
    }

    next(): void {
        if (this.state === HomeTutorialState.Done) return;
        const steps = Object.values(HomeTutorialState);
        const currentIndex = steps.indexOf(this.state);
        const nextIndex = (currentIndex + 1) % steps.length;
        this.state = steps[nextIndex];
        this.setLocalStorage();
    }

    skip(): void {
        this.state = HomeTutorialState.Done;
        this.setLocalStorage();
    }

    isDone(): boolean {
        return this.state === HomeTutorialState.Done;
    }

    isLastState(): boolean {
        return this.state === HomeTutorialState.Menu;
    }

    tryGetState(): void {
        const lastState = localStorage.getItem(this.getStorageKey());
        if (lastState)
            this.state = lastState as HomeTutorialState;
    }
}

class NavMenuTutorial extends TutorialBase<typeof NavMenuTutorialState> implements ITutorial<NavMenuTutorialState> {
    storageKeyPrefix: string = 'nav-tutorial-state';
    state: NavMenuTutorialState = NavMenuTutorialState.History;
    position: TutorialPosition | null = null;
    trianglePosition: TutorialTrianglePosition = 'bottom-left';

    isVisible(): boolean {
        return this.position !== null && this.shouldShow();
    }

    shouldShow(): boolean {
        return UIState.showMenu && !UIState.isClosingMenu;
    }

    calculatePosition(elRect: DOMRect, popupRect: DOMRect): void {
        const mediaQuery = window.matchMedia('(max-aspect-ratio: 1/1), (max-width: 920px)');
        this.position = {
            top: elRect.top - popupRect.height - (mediaQuery.matches ? 16 : 0),
            left: 0,
        }
    }

    next(): void {
        if (this.state === NavMenuTutorialState.Done) return;
        const steps = Object.values(NavMenuTutorialState);
        const currentIndex = steps.indexOf(this.state);
        const nextIndex = (currentIndex + 1) % steps.length;
        this.state = steps[nextIndex];
        this.setLocalStorage();
    }

    skip(): void {
        this.state = NavMenuTutorialState.Done;
        this.setLocalStorage();
    }

    isDone(): boolean {
        return this.state === NavMenuTutorialState.Done;
    }

    isLastState(): boolean {
        return this.state === NavMenuTutorialState.Settings;
    }

    tryGetState(): void {
        const lastState = localStorage.getItem(this.getStorageKey());
        if (lastState)
            this.state = lastState as NavMenuTutorialState;
    }
}

class ChatTutorial extends TutorialBase<typeof ChatTutorialState> implements ITutorial<ChatTutorialState> {
    storageKeyPrefix: string = 'chat-tutorial-state';
    state: ChatTutorialState = ChatTutorialState.Welcome;
    position: TutorialPosition | null = null;
    trianglePosition: TutorialTrianglePosition = 'bottom-middle';

    isVisible(route: RouteLocationNormalizedLoaded): boolean {
        return this.position !== null && this.shouldShow(route);
    }

    shouldShow(route: RouteLocationNormalizedLoaded): boolean {
        return route.matched.some((p) => p.name === 'Chat') &&
            (!UIState.showMenu || UIState.isClosingMenu);
    }

    calculatePosition(elRect: DOMRect, popupRect: DOMRect): void {
        const mediaQuery = window.matchMedia('(max-aspect-ratio: 1/1), (max-width: 920px)');
        switch (this.state) {
            case ChatTutorialState.Welcome:
                this.position = {
                    top: elRect.top - popupRect.height - (mediaQuery.matches ? 8 : 0),
                    left: elRect.left + elRect.width / 2 - popupRect.width / 2
                };
                break;
            case ChatTutorialState.Input:
                this.position = {
                    top: elRect.top - popupRect.height - 16,
                    left: window.innerWidth / 2 - popupRect.width / 2
                }
                break;
            case ChatTutorialState.Sidepanel:
                this.trianglePosition = 'right-bottom';
                this.position = {
                    top: elRect.top - popupRect.height * 0.55,
                    left: elRect.left - popupRect.width - 16
                }
                break;
            default:
                this.position = null;
                break;
        }
    }

    next(): void {
        if (this.state === ChatTutorialState.Done) return;
        const steps = Object.values(ChatTutorialState);
        const currentIndex = steps.indexOf(this.state);
        const nextIndex = (currentIndex + 1) % steps.length;
        this.state = steps[nextIndex];
        this.setLocalStorage();
    }

    skip(): void {
        this.state = ChatTutorialState.Done;
        this.setLocalStorage();
    }

    isDone(): boolean {
        return this.state === ChatTutorialState.Done;
    }

    isLastState(): boolean {
        return this.state === ChatTutorialState.Sidepanel;
    }

    tryGetState(): void {
        const lastState = localStorage.getItem(this.getStorageKey());
        if (lastState)
            this.state = lastState as ChatTutorialState;
    }
}

export const TutorialStates = reactive<{
    home: HomeTutorial;
    nav: NavMenuTutorial;
    chat: ChatTutorial;
    shouldUpdatePosition: boolean;
}>({
    home: new HomeTutorial(),
    nav: new NavMenuTutorial(),
    chat: new ChatTutorial(),
    shouldUpdatePosition: false,
});
