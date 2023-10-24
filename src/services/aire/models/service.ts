import { AireConfig } from "..";

export enum AireServiceType {
    ID = 'id',
    AI = 'ai',
    Memory = 'memory',
}

export interface AireService {
    name: string;
    url: string;
    key: string;
}

export interface AireSystem {
    config: AireConfig;
    services: { [id in AireServiceType]? : AireService }
}
