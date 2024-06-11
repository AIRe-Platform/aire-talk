import { AireServices, AireUser, AireStatus } from "aire";
import { reactive } from "vue";
import useChat from "./chat";
import useContent from "./content";

export class LoginContext {
    public user?: AireUser;
    private credentials?: { username: string, password: string }

    public async login(username: string, password: string): Promise<boolean> {
        if (AireServices.ID) {
            const status = await AireServices.ID.login(username, password);
            if (status == AireStatus.Success) {
                const userResponse = await AireServices.ID.getUser();
                if (userResponse.status == AireStatus.Success) {
                    this.user = userResponse.data
                    this.saveSession()
    
                    // need credentials for re-login
                    if (!this.user?.verified) {
                        this.credentials = { username: username, password: password }
                    }
    
                    useChat().reset(false, true);
                    return true;
                }
            }
        }
        return false;
    }

    public async signup(email: string, password: string): Promise<AireStatus> {
        if (AireServices.ID) {
            const status = await AireServices.ID.signup(email, password);
            if (status === AireStatus.Success) {
                const loggedIn = await this.login(email, password);
                return loggedIn ? AireStatus.Success : AireStatus.UnknownError;
            }
            return status;
        }
        return AireStatus.UnknownError;
    }

    public async logout() {
        this.user = undefined;
        this.credentials = undefined;
    
        localStorage.removeItem("aire_session_token");
    
        if (AireServices.ID) {
            AireServices.ID.logout();
        }
    
        await useChat().reset(false, true);
        useContent().reset();
    }

    public async saveProfile(user: AireUser): Promise<AireUser | undefined> {
        if (AireServices.ID) {
            const result = await AireServices.ID.saveProfileData(user)
            if (result.status == AireStatus.Success) {
                this.user = result.data
            }
            return result.data
        }
        return undefined
    }
    
    public async changePassword(current_password: string, new_password: string): Promise<boolean> {
        if (AireServices.ID && this.user) {
            const status = await AireServices.ID.changePassword(this.user.uuid, current_password, new_password)
            if (status == AireStatus.Success) {
                // Need to log in again
                const email = this.user?.email
                await this.logout();
                if (email)
                    return await this.login(email, new_password);
            }
        }
        return false;
    }
    
    public async verifyAccount(code: string): Promise<boolean> {
        if (AireServices.ID && this.user && !this.user.verified && this.credentials) {
            const status = await AireServices.ID.verifyUserCode(code);
            if (status == AireStatus.Success) {
                const result = await this.login(this.credentials.username, this.credentials.password)
                this.credentials = undefined;
                return result;
            }
        }
        return false;
    }
    
    public async resendVerification(): Promise<boolean> {
        if (AireServices.ID && this.user && !this.user.verified) {
            const status = await AireServices.ID.resendVerification();
            return status == AireStatus.Success
        }
        return false;
    }
    
    public async restoreSession(): Promise<boolean> {
        const token = localStorage.getItem("aire_session_token");
        if (AireServices.ID && token) {
            console.debug("Restoring session...");
            await useChat().reset(false, true);
    
            const status = await AireServices.ID.verifyToken(token);
            if (status == AireStatus.Success) {
                const userResponse = await AireServices.ID.getUser();
                if (userResponse.status == AireStatus.Success) {
                    this.user = userResponse.data;
                    this.saveSession()
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
    return context;
}
