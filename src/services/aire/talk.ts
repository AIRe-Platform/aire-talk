import { Role } from "../openai/models/Role";

export interface AireTalkMessage
{
    role?: Role;
    message?: string;
    final: boolean;
}

export type AireTalkReceiver = (message: AireTalkMessage) => void;
