// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

let logoutTimer: number | undefined;
let listenersAttached = false; // To track if event listeners are already attached
let resetHandler: (() => void) | null = null; // Store reference to handler

const LOGOUT_TIMER_START = 30 * 60 * 1000;   // 30 minutes in milliseconds: 30 * 60 * 1000;

const resetLogoutTimer = (logoutCallback: () => void) => {
    if (logoutTimer) {
        clearTimeout(logoutTimer);
    }

    logoutTimer = setTimeout(logoutCallback, LOGOUT_TIMER_START);
};

export const startInactivityListener = (logoutCallback: () => void) => {
    if (listenersAttached) 
        return; // Prevent re-adding event listeners

    resetHandler = () => {
        resetLogoutTimer(logoutCallback);
    };

    // Attach event listeners for user activity
    window.addEventListener('mousemove', resetHandler as EventListener);
    window.addEventListener('keydown', resetHandler as EventListener);
    window.addEventListener('scroll', resetHandler as EventListener, { passive: true });
    window.addEventListener('click', resetHandler as EventListener);

    listenersAttached = true;
    resetLogoutTimer(logoutCallback);
};

export const stopInactivityListener = () => {
    if (!listenersAttached || !resetHandler) 
        return; // Only remove if attached

    window.removeEventListener('mousemove', resetHandler as EventListener);
    window.removeEventListener('keydown', resetHandler as EventListener);
    window.removeEventListener('scroll', resetHandler as EventListener);
    window.removeEventListener('click', resetHandler as EventListener);

    listenersAttached = false;
    resetHandler = null; // Clear the reference to the handler

    if (logoutTimer) {
        clearTimeout(logoutTimer);
    }
};
