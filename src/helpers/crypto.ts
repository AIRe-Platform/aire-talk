// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


export function randomHexString(bytes: number) {
    return [...crypto.getRandomValues(new Uint8Array(bytes))]
        .map(x => x.toString(16))
        .join('');
}

export async function SHA256(input: string) {
    const buf = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", buf);
    const data = new DataView(digest);
    let hash = "";
    for (let i = 0; i < data.byteLength; i++)
        hash += data.getUint8(i).toString(16).padStart(2, "0");
    return hash;
}
