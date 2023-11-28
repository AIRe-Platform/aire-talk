export interface AireTalkMessage
{
    role?: AireRole;
    message?: string;
    final: boolean;
}

export type AireRole = "ai" | "user" | "system";

export type AireTalkReceiver = (message: AireTalkMessage) => void;
