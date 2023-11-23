import { Services } from "@/services/aire";
import { reactive } from "vue";

export const Login = reactive({
    logged_in: false
});

export async function login(email: string, password: string) : Promise<boolean>
{
    if(Services.ID)
    {
        const result = await Services.ID.login(email, password);
        Login.logged_in = result;
        return result;
    }
    return new Promise(res => res(false));
}

export async function signup(email: string, password: string): Promise<number>
{
    if(Services.ID)
    {
        Services.ID.signup(email, password)
            .then(async (status) => {
                if(status === 204)
                {
                    const result = await login(email, password);
                    if(!result)
                        return 403;
                }
                return status;
            })
    }
    return new Promise(res => res(0));
}

export async function changePassword(current_password: string, new_password: string): Promise<boolean>
{
    if(Services.ID)
    {
        const username = Services.ID.User.profile?.email;
        if(username)
        {
            Services.ID.changePassword(current_password, new_password)
                .then(async (result) => {
                    if(result) {
                        logout();
                        return await login(username, new_password);
                    }
                    return result;
                })
        }
    }
    return new Promise(res => res(false));
}

export function logout()
{
    Login.logged_in = false;
    if(Services.ID)
    {
        Services.ID.logout();
    }
}
