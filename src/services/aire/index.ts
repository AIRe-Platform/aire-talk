import { reactive } from "vue";
import { AirePlatformConfiguration, AireService } from "./models/service";
import { AireID } from "./id";
import { AireAI } from "./ai";
import { AireMemory } from "./memory";

export interface AireConfig {
    api_url: string;
}

export class AireState {
    public status: "init" | "ready" | "error";

    constructor()
    {
        this.status = "init";
    }
}

export interface AireServices
{
    ID?: AireID;
    AI?: AireAI;
    Memory?: AireMemory;
    ThirdParty?: AireService[];
}

let conf: AireConfig;

export const State = reactive(new AireState());
export const Services: AireServices = {};

export async function initAire(config: AireConfig) : Promise<boolean>
{
    conf = config;

    // Request service configuration from AIRe Services Hub
    const url = new URL(conf.api_url + "/v1/config");
    return fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })    
    .then(async (result) => {
        if(result.status === 200) {
            const plat = await result.json();
            return await configureServices(plat);
        }
        else {
            throw Error(`Failed to get platform configuration: ${result.status}`);
        }
    })
    .catch((reason) => {
        console.error(reason);
        State.status = "error";
        return false;
    })
}

function configureServices(config: AirePlatformConfiguration) : Promise<boolean>
{
    console.debug("Platform config:", config)

    return new Promise<boolean>((resolve, reject) => {

        try
        {
            const id_config = config.platform.modules.id;
            if(id_config !== undefined)
            {
                Services.ID = new AireID("default", id_config);
            }

            const ai_config = config.platform.modules.ai;
            if(ai_config !== undefined)
            {
                Services.AI = new AireAI(ai_config);
            }

            const mem_config = config.platform.modules.memory;
            if(mem_config !== undefined)
            {
                Services.Memory = new AireMemory(mem_config);
            }

            State.status = "ready"
            resolve(true);
        }
        catch(reason)
        {
            console.error(reason);
            State.status = "error";
            reject(reason);
        }
    })
}


