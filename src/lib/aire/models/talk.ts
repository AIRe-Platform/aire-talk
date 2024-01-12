import { AireRole } from "./chat";

export interface AireTalkMessage
{
    role?: AireRole;
    message?: string;
    final: boolean;
}

export type AireTalkReceiver = (message: AireTalkMessage) => void;
