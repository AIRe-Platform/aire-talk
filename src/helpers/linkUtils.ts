// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { sanitizeUrl } from "./sanitizer";

export function openInNewTab(url: string) {
    const sanitized = sanitizeUrl(url);
    if (sanitized) {
        const link = document.createElement("a");
        link.setAttribute("href", sanitized);
        link.setAttribute("target", '_blank');
        link.style.visibility = "hidden";

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}
