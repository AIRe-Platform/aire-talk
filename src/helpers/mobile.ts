export function useMobileLayout(): boolean
{
    const view = document.defaultView;
    if(!view)
        return false;

    const portrait = (view.innerWidth / view.innerHeight <= 1/1);
    const narrow = (view.innerWidth < 920);

    return portrait || narrow;
}

export default useMobileLayout;
