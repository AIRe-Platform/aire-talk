import { AireServices, AireUser, AireScope, AireStatus } from "aire";
import { reactive } from "vue";
import { createNewChat } from "./chat";

export const Login = reactive<{
    user?: AireUser,
    credentials?: { username: string, password: string }
}>({});

export async function login(username: string, password: string): Promise<boolean> {
    if (AireServices.ID) {
        const status = await AireServices.ID.login(username, password);
        if (status == AireStatus.Success) {
            const userResponse = await AireServices.ID.getUser();
            if (userResponse.status == AireStatus.Success) {
                Login.user = userResponse.data
                saveSession()

                // need credentials for re-login
                if (!Login.user?.verified) {
                    Login.credentials = { username: username, password: password }
                }

                await createNewChat()
                return true;
            }
        }
    }
    return false;
}

export async function signup(email: string, password: string): Promise<AireStatus> {
    if (AireServices.ID) {
        const status = await AireServices.ID.signup(email, password);
        if (status === AireStatus.Success) {
            const loggedIn = await login(email, password);
            return loggedIn ? AireStatus.Success : AireStatus.UnknownError;
        }
        return status;
    }
    return AireStatus.UnknownError;
}

export async function saveProfile(user: AireUser): Promise<AireUser | undefined> {
    if (AireServices.ID) {
        const result = await AireServices.ID.saveProfileData(user)
        if (result.status == AireStatus.Success) {
            Login.user = result.data
        }
        return result.data
    }
    return undefined
}

export async function changePassword(current_password: string, new_password: string): Promise<boolean> {
    if (AireServices.ID && Login.user) {
        const status = await AireServices.ID.changePassword(Login.user.uuid, current_password, new_password)
        if (status == AireStatus.Success) {
            // Need to log in again
            const email = Login.user?.email
            await logout();
            if (email)
                return await login(email, new_password);
        }
    }
    return false;
}

export async function verifyAccount(code: string): Promise<boolean> {
    if (AireServices.ID && Login.user && !Login.user.verified && Login.credentials) {
        const status = await AireServices.ID.verifyUserCode(code);
        if (status == AireStatus.Success) {
            const result = await login(Login.credentials.username, Login.credentials.password)
            Login.credentials = undefined;
            return result;
        }
    }
    return false;
}

export async function resendVerification(): Promise<boolean> {
    if (AireServices.ID && Login.user && !Login.user.verified) {
        const status = await AireServices.ID.resendVerification();
        return status == AireStatus.Success
    }
    return false;
}

export async function logout() {
    Login.user = undefined;
    Login.credentials = undefined;

    localStorage.removeItem("aire_session_token");

    if (AireServices.ID) {
        AireServices.ID.logout();
    }

    await createNewChat()
}

export async function restoreSession(): Promise<boolean> {
    const token = localStorage.getItem("aire_session_token");
    if (AireServices.ID && token) {
        console.debug("Restoring session...")
        await createNewChat()

        const status = await AireServices.ID.verifyToken(token);
        if (status == AireStatus.Success) {
            const userResponse = await AireServices.ID.getUser();
            if (userResponse.status == AireStatus.Success) {
                Login.user = userResponse.data;
                saveSession()
                return true;
            }
        }
    }
    return false;
}

function saveSession() {
    const token = AireServices.ID?.getAccessToken();
    if (token) {
        localStorage.setItem("aire_session_token", token);
    }
}
