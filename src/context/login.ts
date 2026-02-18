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
import { useCache } from "./cache";
import usePlatform from "./platform";
import { router } from "@/router";

const statistics = useStatistics();

interface LoginAuthState {
    state: string;
    code_verifier: string;
}

export interface LoginSession {
    access_token?: string;
    invite?: {
        token: string;
        chat_id: string;
        allow_upgrade: boolean;
    }
}

export interface LoginAuthResult {
    ok: boolean;
    error?: AireErrorResult;
}

export class LoginContext {
    public user?: AireUser;
    public session?: LoginSession;
    private auth_state?: LoginAuthState;

    private SESSION_KEY = "aire_session";
    private AUTH_STATE_KEY = "aire_auth_state";

    constructor() {
        const auth_state_data = window.sessionStorage.getItem(this.AUTH_STATE_KEY);
        if (auth_state_data)
            this.auth_state = JSON.parse(auth_state_data);
    }

    public async redirectToLogin(): Promise<boolean> {
        if (!AireServices.ID)
            return false;

        const options: AireLoginOptions = {
            state: randomHexString(32),
            code_challenge: randomHexString(32),
            code_challenge_method: "S256",
            redirect_uri: document.location.origin + "/auth/callback",
            locale: getUILanguage().value,
            theme: useTheme().style.includes("dark") ? "dark" : "light",
        };

        const state = {
            state: options.state,
            code_verifier: await SHA256(options.code_challenge!)
        };

        window.sessionStorage.setItem(this.AUTH_STATE_KEY, JSON.stringify(state));

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

    public async loginWithInvitation(inviteToken: string): Promise<AireStatus> {
        if (!AireServices.ID)
            return AireStatus.NotSupported;

        if (this.session && this.session.invite?.token !== inviteToken) {
            await this.logout("invite=" + inviteToken);
            return AireStatus.NotSupported;
        }

        return await AireServices.ID.validateInvite(inviteToken)
            .then(async res => {
                if (!res.data)
                    return res.status;

                if (res.data.platform) {
                    const validPlatform = await usePlatform().switch(res.data.platform, false);
                    if (!validPlatform)
                        return AireStatus.BadRequest;
                }

                if (!AireServices.ID)
                    return AireStatus.NotSupported;

                const status = await AireServices.ID.verifyToken(res.data.auth.access_token);
                if (status === AireStatus.Success) {
                    this.session ??= {};
                    this.session.access_token = res.data.auth.access_token;
                    this.session.invite = {
                        token: inviteToken,
                        chat_id: res.data.chat_id,
                        allow_upgrade: res.data.account_upgrade,
                    }

                    const sessionStarted = await this.startSession();
                    if (!sessionStarted)
                        return AireStatus.UnknownError;

                    router.push({
                        name: "Chat", params: {
                            id: res.data.chat_id
                        }
                    });
                }

                return status;
            })
            .catch(err => {
                console.error("Failed to login with in invitation", err);
                return AireStatus.UnknownError;
            })
    }

    public async upgradeTrial(password: string): Promise<AireStatus> {
        if (!AireServices.ID || !this.session?.invite?.allow_upgrade)
            return AireStatus.NotSupported;
        return await AireServices.ID.signupWithInvite(this.session.invite.token, { password: password });
    }

    public async signup(email: string, password: string): Promise<AireStatus> {
        if (!AireServices.ID)
            return AireStatus.NotSupported;

        const status = await AireServices.ID.signup(email, password);
        return status;
    }

    public async logout(return_params?: string) {
        await useChat().reset(false, true);

        useContent().reset();
        useCache().reset();

        statistics.sendEvent(new SessionEvent(
            this.user?.uuid,
            statistics.session?.id,
            SessionEventName.End
        )).finally(() => {
            statistics.session = undefined;
        });

        this.user = undefined;
        this.session = undefined;
        localStorage.removeItem(this.SESSION_KEY);

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
        const session_data = localStorage.getItem(this.SESSION_KEY);
        if (AireServices.ID && session_data) {
            console.debug("Restoring session...");
            this.session = JSON.parse(session_data);

            const status = await AireServices.ID.verifyToken(this.session?.access_token);
            if (status == AireStatus.Success) {
                return await this.startSession();
            }
        }
        return false;
    }

    public saveSession() {
        const token = AireServices.ID?.getAccessToken();
        if (token) {
            this.session ??= {};
            this.session.access_token = token;

            const data = JSON.stringify(this.session);
            localStorage.setItem(this.SESSION_KEY, data);
        }
    }

    private async startSession() {
        if (!AireServices.ID)
            return false;

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

        return false;
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
