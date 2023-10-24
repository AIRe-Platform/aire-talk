import { AireSystem } from "./models/service";

export interface AireConfig {
    api_url: string;
    api_key: string;
}

let systemConfiguration: AireSystem | null = null;

export function initAire(config: AireConfig)
{
    // TODO: Request service configuration from AIRe Services Hub
    systemConfiguration = {
        config: config,
        services: {}
    }
}

export function getSystemConfig(): AireSystem | null
{
    return systemConfiguration;
}
