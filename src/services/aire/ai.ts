import { AireTalkReceiver } from "./models/talk";
import { AireModule, AireModuleType } from "./models/service";
import { AireErrorHandler, AireErrorKey } from "./models/error";
import { ChatHistory } from "@/models/chat";
import { 
    AireChatbotRequest, 
    AireChatbot,
     AireChatMessage, 
     AireChatbotEventType, 
     AireChatbotOutput, 
     AireChatbotErrorEvent 
} from "./models/chatbot";
import { Services } from ".";

export class AireAI
{
    private config: AireModule;
    private selectedBot: string;

    constructor(config: AireModule)
    {
        if(config.type !== AireModuleType.AI)
            throw Error("Module configuration is not for an AI module");

        this.config = config;
        this.selectedBot = "default";
    }

    public stream(chat: ChatHistory, callback: AireTalkReceiver, onError?: AireErrorHandler)
    {
        const url = new URL(this.config.endpoint + "/bot/" + this.selectedBot + "/stream");
        const headers: { [key: string]: string } = {
            "Accept": "text/event-stream",
            "Content-Type": "application/json"
        };

        if(Services.ID)
        {
            const token = Services.ID.getAccessToken();
            if(token)
                headers["Authorization"] = `Bearer ${token}`
        }

        const req: AireChatbotRequest = {
            input: { 
                chat: chat.map(x => {
                    const m: AireChatMessage = {
                        name: x.role,
                        content: x.message
                    };
                    return m;
                }) 
            }
        };

        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(req)
        })
        .then(async (response) => {
            if(!response.ok)
                throw Error(response.statusText);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            let done = false;
            let value: any = null;
            let buf: string = "";
    
            while(reader)
            {
                ({ value, done } = await reader.read());
                if(done) break;
                buf += decoder.decode(value);
                
                const lines = buf.split("\n");
                let dataEvent: AireChatbotEventType | undefined;
                buf = "";
                lines.forEach(line => {
                    if(buf.length > 0)
                    {
                        console.error("Incomplete data placed in buffer, buf it was not the last line.", lines, value);
                        throw Error(AireErrorKey.Unknown);
                    }

                    if(line.startsWith("event: "))
                    {
                        const eventType = line.substring(line.indexOf(":") + 1).trim();
                        if(eventType === AireChatbotEventType.End)
                        {
                            callback({ final: true });
                            return;
                        }
                        else if ((<any>Object).values(AireChatbotEventType).includes(eventType))
                        {
                            dataEvent = eventType as AireChatbotEventType;
                        }
                        else
                        {
                            buf += line;
                        }
                    }
                    else if (line.startsWith("data: "))
                    {
                        const value = line.substring(line.indexOf(":") + 1).trim();
                        if(dataEvent === AireChatbotEventType.Data)
                        {
                            try
                            {
                                const output = JSON.parse(value) as AireChatbotOutput;
                                callback({ message: output.content, role: output.type, final: false});
                            }
                            catch(reason)
                            {
                                console.error(reason);

                                // Probably incomplete data
                                buf += "event: data\n";
                                buf += line;
                            }
                        }
                        else if (dataEvent == AireChatbotEventType.Error)
                        {
                            try
                            {
                                const err = JSON.parse(value) as AireChatbotErrorEvent;
                                if(onError)
                                {
                                    onError({
                                        key: AireErrorKey.AiNotResponding,
                                        error: Error(`${err.status_code.toString()}: ${err.message}`)
                                    });
                                }
                            }
                            catch(reason)
                            {
                                console.error(reason);

                                // Probably incomplete data
                                buf += "event: error\n";
                                buf += line;
                            }
                        }
                        else if (dataEvent == AireChatbotEventType.Metadata)
                        {
                            console.debug("Metadata received");
                        }
                        else
                        {
                            console.warn("Unhandled data", line);
                        }
                    }
                    else if(line.trim().length > 0 && !line.startsWith(": ping"))
                    {
                        buf += line;
                    }
                });
            }
        })
        .catch((reason) => {
            console.error(reason);
            if(onError)
                onError({ key: AireErrorKey.AiNotResponding });
        });
    }

    private getBots(): Promise<AireChatbot[]>
    {
        return new Promise((res) => res([]));
    }
}
