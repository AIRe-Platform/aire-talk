import { UIMode, UISettings } from "@/context/ui";

export function useMobileLayout(): boolean {
    const view = document.defaultView;
    if (!view)
        return false;

    const portrait = (view.innerWidth / view.innerHeight <= 1 / 1);
    const narrow = (view.innerWidth <= 920);

    if (UISettings.uiMode === UIMode.Mobile)
        return true;

    return portrait || narrow;
}

export default useMobileLayout;
