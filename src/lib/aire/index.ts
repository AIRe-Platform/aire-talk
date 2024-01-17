import { AirePlatformConfiguration, AireService } from "./models/service";
import { AireID } from "./id";
import { AireAI } from "./ai";
import { AireMemory } from "./memory";

export interface AireConfig {
    api_url: string;
}

export interface AireServiceCollection
{
    ID?: AireID;
    AI?: AireAI;
    Memory?: AireMemory;
    ThirdParty?: AireService[];
}

let conf: AireConfig;
export const AireServices: AireServiceCollection = {};

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
            return configureServices(plat);
        }
        else {
            throw Error(`Failed to get platform configuration: ${result.status}`);
        }
    })
    .catch((reason) => {
        console.error(reason);
        return false;
    })
}

function configureServices(config: AirePlatformConfiguration) : boolean
{
    console.debug("Platform config:", config)

    try
    {
        const id_config = config.platform.modules.id;
        if(id_config !== undefined)
        {
            AireServices.ID = new AireID(id_config);
        }

        const ai_config = config.platform.modules.ai;
        if(ai_config !== undefined)
        {
            AireServices.AI = new AireAI(ai_config);
        }

        const mem_config = config.platform.modules.memory;
        if(mem_config !== undefined)
        {
            AireServices.Memory = new AireMemory(mem_config);
        }

        return true
    }
    catch(reason)
    {
        console.error(reason);
        return false
    }
}


