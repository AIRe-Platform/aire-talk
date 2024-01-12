export enum AireModuleType {
    ID = 'id',
    AI = 'ai',
    Memory = 'memory',
}

export enum AireModuleAccess {
    Public = 'public',
    Private = 'private',
}

export interface AireService {
    name: string;
    modules: AireModule[];
}

export interface AireServiceCredentials {
    name: string;
    token: string;
}

export interface AireModule {
    type: AireModuleType;
    access: AireModuleAccess;
    endpoint: string;
}

export interface AirePlatform {
    name: string;
    modules: { [id in AireModuleType]?: AireModule }
}

export interface AirePlatformConfiguration {
    platform: AirePlatform;
    services: AireService[];
}
