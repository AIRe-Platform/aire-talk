import { OpenAIMessage } from "../openai";

export type AireTalkReceiver = (message: OpenAIMessage | null, final: boolean) => void;
