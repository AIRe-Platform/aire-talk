// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export const switchFocus = (next: boolean, parent: HTMLElement | null) => {
    if (!parent) return;
    const focusableElements = parent.querySelectorAll<HTMLElement>('a, button, input, textarea, select, [tabindex]');
    if (!focusableElements) return;
    const index = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);
    let nextIndex = 0;
    if (index !== -1) {
        nextIndex = (index + (next ? 1 : -1) + focusableElements.length) % focusableElements.length;
    } else if (index === -1 && !next) {
        nextIndex = focusableElements.length - 1;
    }
    focusableElements[nextIndex].focus();
};
