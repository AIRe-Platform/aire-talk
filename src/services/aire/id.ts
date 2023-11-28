import { AireUser } from "./models/user"
import { AireModule, AireModuleType } from "./models/service";
import { TokenResponse } from "./models/token";

export class AireID
{
    private config: AireModule;
    private name: string;

    public User: { 
        profile: AireUser | null,
        token: TokenResponse | null
    } = { profile: null, token: null };

    constructor(name: string, config: AireModule)
    {
        if(config.type !== AireModuleType.ID)
            throw Error("Module configuration is not for an ID module");
        this.name = name;
        this.config = config;
    }

    public async login(email: string, password: string) : Promise<boolean>
    {
        const url = new URL(this.config.endpoint + "/oauth/token");

        const form = new FormData();
        form.append("grant_type", "password");
        form.append("username", email);
        form.append("password", password);
        // Append scope filed if needed

        return fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: form
        })
        .then(async (response) => {
            if(response.status === 200)
            {
                const token = await response.json() as TokenResponse;
                this.User.token = token;

                const user = await this._fetchUserData();
                if(user !== undefined)
                {
                    this.User.profile = user;
                    this._storeSession();
                    console.debug("Login successful!");
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                console.error("Token response:", response);
                throw Error("Failed to get token")
            }

        })
        .catch((reason) => {
            console.error(reason);
            return false;
        })
    }

    public logout()
    {
        localStorage.removeItem(this.name + "_token");
        this.User = { profile: null, token: null };
    }

    public async restoreSession() : Promise<boolean>
    {
        const token = localStorage.getItem(this.name + "_token");
        if(token !== null)
        {
            console.debug("Restoring session...");

            return this._verifyToken(token)
                .then(async tokenInfo => {
                    if(tokenInfo != null)
                    {
                        this.User.token = tokenInfo;
                        console.log("Token is valid", tokenInfo);
                        const user = await this._fetchUserData();
                        if(user !== null)
                        {
                            this.User.profile = user;
                            return true;
                        }
                    }

                    throw Error("Invalid token");
                })
                .catch((reason) => {
                    console.error("Failed to restore session:", reason);
                    this.logout();
                    return false;
                })
        }
        return new Promise((resolve) => resolve(false));
    }

    public async signup(email: string, password: string) : Promise<number>
    {
        const url = new URL(this.config.endpoint + "/v1/signup");
        const body = { credentials: { email, password }};
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then((result) => {
            return result.status;
        })
        .catch((reason) => {
            console.error(reason);
            return 0;
        })
    }

    public async saveProfileData(profile: AireUser) : Promise<boolean>
    {
        if(this.User.profile == null)
            return new Promise(res => res(false));

        const url = new URL(this.config.endpoint + "/v1/user/" + profile.uuid)
        return fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${this.User.token?.access_token}`,
                "Content-Type": "application/json",
                "Accept": "applicaion/json" 
            },
            body: JSON.stringify(profile)
        })
        .then(async (result) => {
            if(result.status === 200)
            {
                const updated = await result.json() as AireUser;
                this.User.profile = updated;
                return true;
            }
            else return false;
        })
        .catch((reason) => {
            console.error(reason);
            return false;
        })
    }

    public async deleteProfile(password: string, keep_anonymized_data: boolean = false): Promise<boolean>
    {
        if(this.User.profile == null)
            return new Promise(res => res(false));

        const url = new URL(this.config.endpoint + "/v1/user/" + this.User.profile.uuid);
        const body = { password, keep_anonymized_data };
        return fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${this.User.token?.access_token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then((result) => {
            return result.status === 204;
        })
        .catch((reason) => {
            console.log(reason);
            return false;
        });
    }

    public async changePassword(current_password: string, new_password: string): Promise<boolean>
    {        
        if(this.User.profile == null)
            return new Promise(res => res(false));

        const url = new URL(this.config.endpoint + "/v1/user/" + this.User.profile.uuid + "/password");
        const body = { current_password, new_password };
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.User.token?.access_token}`
            },
            body: JSON.stringify(body)
        })
        .then((response) => {
            return response.status === 204;
        })
        .catch((reason) => {
            console.error(reason);
            return false;
        })
    }

    public getAccessToken() : string | undefined
    {
        return this.User.token?.access_token;
    }

    private async _verifyToken(token: string): Promise<TokenResponse | null>
    {
        const url = new URL(this.config.endpoint + "/oauth/tokeninfo/" + encodeURIComponent(token));
        return fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })
        .then(async (response) => {
            if(response.status === 200)
            {
                return await response.json() as TokenResponse;
            }
            else
            {
                return null;
            }
        })
        .catch((reason) => {
            console.error(reason);
            return null;
        })
    }

    private async _fetchUserData() : Promise<AireUser | null>
    {
        const url = new URL(this.config.endpoint + "/v1/user");
        if(this.User.token === null)
            throw Error("Token is not set");

        return fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${this.User.token.access_token}`
            }
        })
        .then(async (response) => {
            if(response.status === 200) {
                return await response.json() as AireUser;
            }
            else {
                console.error("Failed to fetch user data:", response);
                throw Error("Failed to get user data");
            }
        })
        .catch((reason => {
            console.error(reason);
            return null;
        }));
    }

    private _storeSession()
    {
        if(this.User.token !== null)
        {
            localStorage.setItem(this.name + "_token", this.User.token.access_token);
        }
    }
}
