// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { aireInit } from "aire";
import { reactive } from "vue";
import useLogin from "./login";

export class PlatformContext {
    defaultConfig: string = import.meta.env.VITE_AIRE_PLATFORM;

    public async init(): Promise<boolean> {
        const config = this.current();

        return await aireInit({
            api_url: import.meta.env.VITE_AIRE_SERVICES_ENDPOINT,
            client_id: import.meta.env.VITE_AIRE_CLIENT_ID,
            config_id: config
        })
            .then(() => {
                return true;
            })
            .catch(async err => {
                console.error("Failed to initialize AIRe services", err);
                if (config !== this.defaultConfig) {
                    // Reset to default config and try again
                    this.reset();
                    return await this.init();
                }
                return false;
            });
    }

    public async switch(id: string) {
        const valid = await aireInit({
            api_url: import.meta.env.VITE_AIRE_SERVICES_ENDPOINT,
            client_id: import.meta.env.VITE_AIRE_CLIENT_ID,
            config_id: id
        }).catch(_ => false);

        if (valid) {
            window.sessionStorage.setItem("aire_platform_config", id);
            await useLogin().redirectToLogin();
        }
    }

    public current() {
        return window.sessionStorage.getItem("aire_platform_config") ?? this.defaultConfig;
    }

    private reset() {
        return window.sessionStorage.removeItem("aire_platform_config");
    }
}

const context = reactive<PlatformContext>(new PlatformContext());
function usePlatform() {
    return context;
}

export default usePlatform;
