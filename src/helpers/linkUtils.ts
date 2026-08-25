// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export function openInNewTab(url: string) {
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("target", '_blank');
    link.style.visibility = "hidden";

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
