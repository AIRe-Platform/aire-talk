// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export function downloadObjectAsJson(obj: object, filename: string) {
    const json = JSON.stringify(obj, null, 2);
    const url = URL.createObjectURL(
        new Blob([json], { type: "application/json" })
    );

    const el = document.createElement("a");
    el.href = url;
    el.download = filename;
    el.innerHTML = `Download ${filename}`;
    document.body.appendChild(el);

    el.click();
    el.remove();
    URL.revokeObjectURL(url);
}
