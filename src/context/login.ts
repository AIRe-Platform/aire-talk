import { AireServices, AireUser, AireScope, AireStatus } from "aire";
import { reactive } from "vue";
import { createNewChat } from "./chat";

export const Login = reactive<{
    logged_in: boolean,
    verified: boolean,
    user?: AireUser,
    credentials?: { email: string, pw: string }
}>({ logged_in: false, verified: false });

export async function login(username: string, password: string): Promise<boolean> {
    if (AireServices.ID) {
        const status = await AireServices.ID.login(username, password);
        if (status == AireStatus.Success) {
            Login.logged_in = true;
            Login.verified = !AireServices.ID.hasScope(AireScope.UnverifiedAccount);

            if (Login.verified) {
                const userDataResponse = await AireServices.ID.getUser();
                Login.user = userDataResponse.data
                saveSession()
            }
            else {
                Login.credentials = { email: username, pw: password }
            }

            await createNewChat()
            return true;
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
        if(result.status == AireStatus.Success) {
            Login.user = result.data
        }
        return result.data
    }
    return undefined
}

export async function changePassword(current_password: string, new_password: string): Promise<boolean> {
    if (AireServices.ID && Login.user) {
        const status = await AireServices.ID.changePassword(Login.user.uuid, current_password, new_password)
        if(status == AireStatus.Success) {
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
    if (AireServices.ID && Login.logged_in && !Login.verified && Login.credentials) {
        const status = await AireServices.ID.verifyUserCode(code);
        if (status == AireStatus.Success) {
            const result = await login(Login.credentials.email, Login.credentials.pw)
            Login.credentials = undefined;
            return result;
        }
    }
    return false;
}

export async function resendVerification(): Promise<boolean> {
    if (AireServices.ID && Login.logged_in && !Login.verified) {
        const status = await AireServices.ID.resendVerification();
        return status == AireStatus.Success
    }
    return false;
}

export async function logout() {
    Login.logged_in = false;
    Login.verified = false;
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

        Login.logged_in = status == AireStatus.Success
        Login.verified = !AireServices.ID.hasScope(AireScope.UnverifiedAccount);

        if (Login.logged_in) {
            if (Login.verified) {
                Login.user = (await AireServices.ID.getUser()).data
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
