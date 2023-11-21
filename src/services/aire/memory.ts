import { ChatHistory } from "@/models/chat";
import { AireModule, AireModuleType } from "./models/service";

export class AireMemory
{
    private config: AireModule;

    constructor(config: AireModule)
    {
        if(config.type !== AireModuleType.Memory)
            throw Error("Module configuration is not for a Memory module");

        this.config = config;
    }

    public saveChat(chat: ChatHistory)
    {
        // TODO: Implement
    }

    public getHistory(): Promise<ChatHistory[]>
    {
        return new Promise((resolve, reject) => {
            reject("Not implemented")
        });
    }
}
