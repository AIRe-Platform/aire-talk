export interface AireError {
    key?: AireErrorKey;
    error?: Error;
}

export type AireErrorHandler = (err: AireError) => void;

export enum AireErrorKey {
    Unknown = "error_generic",
    AiNotResponding = "error_ai_not_responding"
}
