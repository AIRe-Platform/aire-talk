import { AireUser } from "./models/user"
import { AireModule, AireModuleType } from "./models/service";
import { TokenResponse } from "./models/token";
import { UnwrapNestedRefs, reactive } from "vue";

export class AireID
{
    private config: AireModule;

    public User: UnwrapNestedRefs<{
        profile: AireUser | null,
        token: TokenResponse | null
    }>;

    constructor(config: AireModule)
    {
        if(config.type !== AireModuleType.ID)
            throw Error("Module configuration is not for an ID module");
        this.config = config;

        this.User = reactive({
            profile: null,
            token: null
        });

        this.restoreSession();
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
                this.User = { profile: null, token: token };

                const user = await this.fetchUserData();
                if(user !== undefined)
                {
                    this.User = { profile: user, token: token };
                    this.storeSession();
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
        localStorage.removeItem("token");
        this.User = { profile: null, token: null };
    }

    private async verifyToken(token: string): Promise<TokenResponse | null>
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

    public saveUser()
    {
        // TODO: Send user data
    }

    private async fetchUserData() : Promise<AireUser | null>
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

    private restoreSession()
    {
        const token = localStorage.getItem("token");
        if(token !== null)
        {
            this.verifyToken(token)
            .then(async tokenInfo => {
                if(tokenInfo != null)
                {
                    this.User = { profile: null, token: tokenInfo };
                    const user = await this.fetchUserData();
                    if(user !== null)
                    {
                        this.User = { profile: user, token: tokenInfo };
                        return;
                    }
                }

                throw Error("Invalid token");
            })
            .catch((reason) => {
                console.error("Failed to restore session:", reason);
                this.logout();
            })
        }
    }

    private storeSession()
    {
        if(this.User.token !== null)
        {
            localStorage.setItem("token", this.User.token.access_token);
        }
    }
}

