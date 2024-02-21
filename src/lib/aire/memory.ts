import { AireModule, AireModuleType } from "./models/service";
import { AireChatHistory, AireChatMetadata, AireChatLog } from "./models/chat";
import { AireServices } from ".";
import { Questionnaire } from "@/models/questionnaire";

export class AireMemory {
    private config: AireModule;

    constructor(config: AireModule) {
        if (config.type !== AireModuleType.Memory)
            throw Error("Module configuration is not for a Memory module");

        this.config = config;
    }

    public async getChatlogs(): Promise<AireChatMetadata[] | undefined> {
        const token = AireServices.ID?.getAccessToken()

        if (!token) return undefined;

        const url = new URL(this.config.endpoint + "/v1/chat-history");
        const headers: { [key: string]: string } = {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        };

        return await fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(async (response) => {
                if (response.status === 200)
                    return await response.json() as AireChatMetadata[];
                else
                    throw Error("Failed to retrieve chat log metadata");
            })
            .catch(reason => {
                console.error(reason);
                return undefined
            })
    }

    public async getChat(id: string): Promise<AireChatLog | undefined> {
        const token = AireServices.ID?.getAccessToken()

        if (!token) return undefined

        const url = new URL(this.config.endpoint + "/v1/chat-history/" + id);
        const headers: { [key: string]: string } = {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        };

        return await fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(async (response) => {
                if (response.status === 200)
                    return await response.json() as AireChatLog;
                else
                    throw Error("Failed to retrieve chat log");
            })
            .catch(reason => {
                console.error(reason);
                return undefined
            })
    }

    public async saveChat(chat: AireChatLog, id?: string): Promise<AireChatMetadata | undefined> {
        const token = AireServices.ID?.getAccessToken()

        if (!token) return undefined;

        const url = new URL(this.config.endpoint + "/v1/chat-history" + (id ? `/${id}` : ""));
        const headers: { [key: string]: string } = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        return await fetch(url, {
            method: id ? "PUT" : "POST",
            headers: headers,
            body: JSON.stringify(chat)
        })
            .then(async (response) => {
                if (response.status === 200)
                    return await response.json() as AireChatMetadata;
                else
                    throw Error("Failed to create/edit chat log");
            })
            .catch(reason => {
                console.error(reason);
                return undefined
            })
    }

    public async deleteChat(id: string): Promise<void> {
        const token = AireServices.ID?.getAccessToken()

        if (!token) return undefined;

        const url = new URL(this.config.endpoint + "/v1/chat-history/" + id);
        const headers: { [key: string]: string } = {
            "Authorization": `Bearer ${token}`
        };

        return await fetch(url, {
            method: "DELETE",
            headers: headers,
        })
            .then(async (response) => {
                if (response.status !== 204)
                    throw Error("Failed to delete chat log");
            })
            .catch(reason => {
                console.error(reason);
                return undefined
            })
    }

    public async getQuestionnaire(id: string): Promise<Questionnaire | undefined> {
        const token = AireServices.ID?.getAccessToken()

        if (!token) return undefined

        const url = new URL(this.config.endpoint + "/v1/questionnaire/" + id);
        const headers: { [key: string]: string } = {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        };

        return await fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(async (response) => {
                if (response.status === 200)
                    return await response.json() as Questionnaire;
                else
                    throw Error("Failed to retrieve chat log");
            })
            .catch(reason => {
                console.error(reason);
                return undefined
            })
    }
}
