import { AireServiceCredentials } from "./service";

export interface AireUser
{
    uuid: string;
    last_login?: string;
    eula_accepted?: string;
    verified: boolean;
    first_name?: string;
    last_name?: string;
    gender?: "male" | "female" | "other";
    age?: number;
    email: string;
    language?: string;
    country?: string;
    bio?: string;
    connected_services?: AireServiceCredentials[];
}
