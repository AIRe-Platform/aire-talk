import { AireUser } from "./models/user"
import { AireModule, AireModuleType } from "./models/service";
import { TokenResponse } from "./models/token";

export class AireID
{
    private config: AireModule;
    private token?: TokenResponse;

    constructor(config: AireModule)
    {
        if(config.type !== AireModuleType.ID)
            throw Error("Module configuration is not for an ID module");
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
                this.token = token;
                console.debug("Login successful!");
                return true;
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
        this.token = undefined;
    }

    public hasScope(scope: string) : boolean
    {
        if(this.token?.scope)
        {
            const scopes = this.token.scope
                .split(" ")
                .map(x => x.trim())
                .filter(x => x.length > 0)
            return scopes.findIndex(x => x === scope) > -1
        }
        return false
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

    public async saveProfileData(profile: AireUser) : Promise<AireUser | undefined>
    {   
        if(!this.token) return undefined;

        const url = new URL(this.config.endpoint + "/v1/user/" + profile.uuid)
        return fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${this.token.access_token}`,
                "Content-Type": "application/json",
                "Accept": "applicaion/json" 
            },
            body: JSON.stringify(profile)
        })
        .then(async (result) => {
            if(result.status === 200)
            {
                const updated = await result.json() as AireUser;
                return updated
            }
            return undefined;
        })
        .catch((reason) => {
            console.error(reason);
            return undefined;
        })
    }

    public async deleteProfile(uuid: string, password: string, keep_anonymized_data: boolean = false): Promise<boolean>
    {
        if(!this.token) return false;

        const url = new URL(this.config.endpoint + "/v1/user/" + uuid);
        const body = { password, keep_anonymized_data };
        return fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${this.token.access_token}`,
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

    public async changePassword(uuid: string, current_password: string, new_password: string): Promise<boolean>
    {        
        if(!this.token) return false;

        const url = new URL(this.config.endpoint + "/v1/user/" + uuid + "/password");
        const body = { current_password, new_password };
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token.access_token}`
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
        return this.token?.access_token;
    }

    public async getUser() : Promise<AireUser | undefined>
    {
        if(!this.token) return undefined;

        const url = new URL(this.config.endpoint + "/v1/user");
        return fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${this.token.access_token}`
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
            return undefined;
        }));
    }

    public async verifyUserCode(code: string) : Promise<boolean>
    {
        if(!this.token) return false;

        const url = new URL(this.config.endpoint + "/v1/verify/" + code);
        return fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.token.access_token}`
            }
        })
        .then(async (response) => {
            return response.status === 204;
        })
        .catch((reason) => {
            console.error(reason);
            return false;
        })
    }

    public async resendVerification() : Promise<boolean>
    {
        if(!this.token) return false;

        const url = new URL(this.config.endpoint + "/v1/verify/resend");
        return fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.token.access_token}`
            }
        })
        .then(async (response) => {
            return response.status === 204;
        })
        .catch((reason) => {
            console.error(reason);
            return false;
        })
    }

    public async verifyToken(token: string): Promise<boolean>
    {
        const url = new URL(this.config.endpoint + "/oauth/tokeninfo");

        const form = new FormData();
        form.append("token", token);

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
                const tokenResponse = await response.json() as TokenResponse;
                this.token = tokenResponse;
                return true;
            }
            else
            {
                return false;
            }
        })
        .catch((reason) => {
            console.error(reason);
            return false;
        })
    }
}
