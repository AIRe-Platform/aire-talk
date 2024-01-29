import { AireServices } from "@/lib/aire";
import { AireUser } from "@/lib/aire/models/user";
import { reactive } from "vue";
import { Chat } from "./chat";
import { AireScope } from "@/lib/aire/models/scopes";
import { router } from "@/router";

export const Login = reactive<{
    logged_in: boolean,
    verified: boolean,
    user?: AireUser
    credentials?: { email: string, pw: string }
}>({ logged_in: false, verified: false });

export async function login(email: string, password: string): Promise<boolean> {
    if (AireServices.ID) {
        const result = await AireServices.ID.login(email, password);

        Login.logged_in = result;
        Login.verified = !AireServices.ID.hasScope(AireScope.UnverifiedAccount);

        if (Login.verified) {
            Login.user = await AireServices.ID.getUser()
            saveSession()
        }
        else {
            Login.credentials = { email: email, pw: password }
            router.push("/verify")
        }

        Chat.reset();
        return result;
    }
    return false;
}

export async function signup(email: string, password: string): Promise<number> {
    if (AireServices.ID) {
        return await AireServices.ID.signup(email, password)
            .then(async (status) => {
                if (status === 204) {
                    const result = await login(email, password);
                    if (!result)
                        return 403;
                }
                return status;
            })
    }
    return 0;
}

export async function changePassword(current_password: string, new_password: string): Promise<boolean> {
    if (AireServices.ID && Login.user) {
        return await AireServices.ID.changePassword(Login.user.uuid, current_password, new_password)
            .then(async (result) => {
                if (result) {
                    logout();
                    return await login(Login.user?.email!, new_password);
                }
                return result;
            })
    }
    return false;
}

export async function verifyAccount(code: string): Promise<boolean> {
    if (AireServices.ID && Login.logged_in && !Login.verified && Login.credentials) {
        let result = await AireServices.ID.verifyUserCode(code);
        if (result) {
            result = await login(Login.credentials.email, Login.credentials.pw)
            Login.credentials = undefined;
            return result;
        }
    }
    return false;
}

export async function resendVerification(): Promise<boolean> {
    if (AireServices.ID && Login.logged_in && !Login.verified) {
        return await AireServices.ID.resendVerification();
    }
    return false;
}

export function logout() {
    Login.logged_in = false;
    Login.verified = false;
    Login.user = undefined;
    Login.credentials = undefined;

    localStorage.removeItem("aire_session_token");

    if (AireServices.ID) {
        AireServices.ID.logout();
    }

    Chat.reset();
}

export async function restoreSession() {
    const token = localStorage.getItem("aire_session_token");
    if (AireServices.ID && token) {
        console.debug("Restoring session...")
        Chat.reset()

        Login.logged_in = await AireServices.ID.verifyToken(token);
        Login.verified = !AireServices.ID.hasScope(AireScope.UnverifiedAccount);

        if (Login.logged_in) {
            if (Login.verified) {
                Login.user = await AireServices.ID.getUser()
                saveSession()
            }
            else {
                router.push("/verify")
            }
        }
    }
}

async function saveSession() {
    const token = AireServices.ID?.getAccessToken();
    if (token) {
        localStorage.setItem("aire_session_token", token);
    }
}
