// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ref } from 'vue';

export const useMobileLayout = ref<boolean>(isMobileResolution());

function isMobileResolution(): boolean {
    const view = document.defaultView;
    if (!view)
        return false;

    const portrait = (view.innerWidth / view.innerHeight <= 1 / 1);
    const narrow = (view.innerWidth <= 920);

    return portrait || narrow;
}

export default useMobileLayout;