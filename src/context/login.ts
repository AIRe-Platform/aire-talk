// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import {
    AireServices,
    AireUser,
    AireStatus,
    AireErrorResult,
    AireLoginOptions,
    AireAuthCodeLoginOptions,
    AireLogoutOptions
} from "aire";
import { reactive, watch } from "vue";
import useChat from "./chat";
import useContent from "./content";
import { randomHexString, SHA256 } from "@/helpers/crypto";
import { getUILanguage } from "@/locales";
import useTheme from "./theme";
import useStatistics from "./statistics";
import {
    ConfigurationEventName,
    ConfigurationEvent,
    SessionEventName,
    SessionEvent
} from "@/models/statistics";

const statistics = useStatistics();

interface LoginAuthState {
    state: string;
    code_verifier: string;
}

export interface LoginAuthResult {
    ok: boolean;
    error?: AireErrorResult;
}

export class LoginContext {
    public user?: AireUser;
    public auth_state?: LoginAuthState;

    constructor() {
        const auth_state_data = window.localStorage.getItem("aire_auth_state");
        if (auth_state_data)
            this.auth_state = JSON.parse(auth_state_data);
    }

    public async redirectToLogin(): Promise<boolean> {
        if (AireServices.ID) {
            const options: AireLoginOptions = {
                state: randomHexString(32),
                code_challenge: randomHexString(32),
                code_challenge_method: "S256",
                redirect_uri: document.location.origin + "/auth/callback",
                locale: getUILanguage().value,
                theme: useTheme().style.includes("dark") ? "dark" : "light",
            };

            this.auth_state = {
                state: options.state!,
                code_verifier: await SHA256(options.code_challenge!)
            };
            window.localStorage.setItem("aire_auth_state", JSON.stringify(this.auth_state));

            try {
                const res = await AireServices.ID.getLoginUrl(options);
                if (res.status == AireStatus.Success && res.data) {
                    window.open(res.data, "_self");
                    return true;
                }
            }
            catch {
                /* fallthru */
            }
        }
        return false;
    }

    public async loginWithAuthenticationCode(code: string, state: string): Promise<LoginAuthResult> {
        if (AireServices.ID && this.auth_state) {
            if (state !== this.auth_state.state) {
                return {
                    ok: false,
                    error: {
                        error: "state_mismatch",
                        error_message: "State mismatch"
                    }
                };
            }

            const options: AireAuthCodeLoginOptions = {
                code: code,
                code_verifier: this.auth_state.code_verifier,
                state: this.auth_state.state,
                redirect_uri: document.location.origin + "/auth/callback",
            };

            const response = await AireServices.ID.loginWithCode(options);

            if (response.status == AireStatus.Success) {
                const userResponse = await AireServices.ID.getUser();
                if (userResponse.status == AireStatus.Success) {
                    this.user = userResponse.data;
                    this.saveSession();
                    await statistics.startSession(this.user?.uuid);
                    statistics.sendEvent(new SessionEvent(
                        this.user?.uuid,
                        statistics.session?.id,
                        SessionEventName.Start
                    ));

                    useChat().reset(false, true);
                    return { ok: true };
                }
                else {
                    return {
                        ok: false,
                        error: {
                            error: "user_request_failed",
                            error_message: "Failed to request user data."
                        }
                    }
                }
            }
            else {
                return { ok: false, error: response.error }
            }
        }
        else {
            return {
                ok: false, error: {
                    error: "unavailable",
                    error_message: "Cannot perform login at this moment."
                }
            };
        }
    }

    public async signup(email: string, password: string): Promise<AireStatus> {
        if (AireServices.ID) {
            const status = await AireServices.ID.signup(email, password);
            return status;
        }
        return AireStatus.UnknownError;
    }

    public async logout(return_params?: string) {
        await useChat().reset(false, true);
        useContent().reset();
        statistics.sendEvent(new SessionEvent(
            this.user?.uuid,
            statistics.session?.id,
            SessionEventName.End
        )).finally(() => {
            statistics.session = undefined;
        });

        this.user = undefined;
        localStorage.removeItem("aire_session_token");

        if (AireServices.ID) {
            const options: AireLogoutOptions = {
                return_url: document.location.origin,
                theme: useTheme().style.includes("dark") ? "dark" : "light",
                locale: getUILanguage().value
            };

            if (return_params) {
                const p = new URLSearchParams(return_params);
                options.return_url += "?" + p.toString();
            }

            const logout = await AireServices.ID.getLogoutUrl(options);
            AireServices.ID.logout();

            if (logout.status == AireStatus.Success && logout.data)
                window.open(logout.data, "_self");
        }
    }

    public async saveProfile(user: AireUser): Promise<AireUser | undefined> {
        if (AireServices.ID) {
            const result = await AireServices.ID.saveProfileData(user);
            if (result.status == AireStatus.Success) {
                this.user = result.data;
                statistics.sendEvent(new ConfigurationEvent(
                    this.user?.uuid,
                    statistics.session?.id,
                    ConfigurationEventName.ProfileUpdate
                ));
            }
            return result.data;
        }
        return undefined;
    }

    public async changePassword(current_password: string, new_password: string): Promise<boolean> {
        if (AireServices.ID && this.user) {
            const status = await AireServices.ID.changePassword(this.user.uuid, current_password, new_password)
            if (status == AireStatus.Success) {
                await this.logout();
                await this.redirectToLogin()
            }
        }
        return false;
    }

    public async restoreSession(): Promise<boolean> {
        const token = localStorage.getItem("aire_session_token");
        if (AireServices.ID && token) {
            console.debug("Restoring session...");

            const status = await AireServices.ID.verifyToken(token);
            if (status == AireStatus.Success) {
                const userResponse = await AireServices.ID.getUser();
                if (userResponse.status == AireStatus.Success) {
                    this.user = userResponse.data;
                    this.saveSession()
                    await statistics.startSession(this.user?.uuid);
                    statistics.sendEvent(new SessionEvent(
                        this.user?.uuid,
                        statistics.session?.id,
                        SessionEventName.Start
                    ));

                    await useChat().reset(false, true);
                    return true;
                }
            }
        }
        return false;
    }

    public saveSession() {
        const token = AireServices.ID?.getAccessToken();
        if (token) {
            localStorage.setItem("aire_session_token", token);
        }
    }
}

const context = reactive(new LoginContext());

export default function useLogin() {

    // Watch for changes in context.user to update when logginin
    watch(
        () => context.user,
        (newUser) => {
            context.user = newUser;
        }
    );
    return context;
}
