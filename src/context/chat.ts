import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { Topic } from "@/models/topic";
import { Services } from "@/services/aire";
import { AireError } from "@/services/aire/models/error";
import { AireUser } from "@/services/aire/models/user";
import { AireTalkMessage } from "@/services/aire/models/talk";
import { reactive } from "vue";

const bot_name = "aire_bot"
const system_name = "aire_system"

export interface ChatState
{
    user: AireUser;
    history: ChatHistory;
    awaitingResponse: boolean;
    scrolling: boolean;
    landingInfo: {
        age?: number;
        occupation?: string;
    };
    checkbox?: Topic;
    OnboardingFromExternalSite?: Topic;

    send: (message: string) => void;
    reset: (to_message?: number) => void;
}

export const Chat: ChatState = reactive(initChatState());

function sendChatMessage(message: string)
{
    Chat.awaitingResponse = true;

    const makeName = () => {
        return `${Chat.user.first_name || ""} ${Chat.user.last_name || ""}`.trim();
    }

    const userMessage: ChatMessage = {
        sender: makeName(),
        role: "user",
        title: "",
        message: message,
        image: "",
        timestamp: Date.now()
    }

    Chat.history.push(userMessage)
    const messages = Chat.history
        .filter(x => x.role === "assistant" || x.role === "user")

    if(Services.AI)
    {
        Services.AI.stream(messages, receiver, error_handler);
    }
    else
    {
        console.warn("AI service is not configured");
    }
}

function receiver(msg: AireTalkMessage)
{
    let last = Chat.history[Chat.history.length - 1];

    if(last.role !== "assistant")
    {
        last = {
            sender: bot_name,
            role: "assistant",
            title: "your answer",
            message: "",
            timestamp: Date.now()
        }
        Chat.history.push(last)
    }

    if(msg && msg.message)
    {
        last.message += msg.message;
    }
    Chat.awaitingResponse = !msg.final;

    if(!Chat.scrolling || msg.final)
    {
        Chat.scrolling = true;
        setTimeout(() => {
            scrollToMessage(last, msg.final ? "start" : "end")
            Chat.scrolling = false;
        }, 1000);
    }
}

function error_handler(error: AireError)
{
    Chat.history.push({
        sender: system_name,
        role: "system",
        isError: true,
        title:  error.key || "",
        message: error.key || error.error?.message || "",
        timestamp: Date.now()
    })

    Chat.awaitingResponse = false;
}

function getChatUser(): AireUser
{
    let user = Services.ID?.User.profile;
    if(!user) // Make anonymous user
    {
        console.debug("Creating anonymous user");
        user = {
            uuid: crypto.randomUUID(),
            email: "",
            verified: false
        }
    }
    else
    {
        console.debug("User chat initialized");
    }
    return user;
}

function systemGreeting() : ChatMessage
{
    return { 
        sender: system_name,
        role: "system",
        message: "system_greeting",
        timestamp: Date.now()
    };
}

function initChatState(): ChatState
{

    const testMessages: ChatHistory = [
        { 
            sender: system_name,
            role: "system",
            message: "system_greeting",
            timestamp: Date.now(),
        },
        { 
            sender: "Juan",
            role: "user",
            message: "I have headache and I feel horrible...",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "What is your age?",
            timestamp: Date.now(),
        },
        { 
            sender: "Juan",
            role: "user",
            message: "I am 36.",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "this is a question",
            question:"How often do you have negative feelings such as blue mood, despair anxiety or depresion?",
            answers:[
                {
                    id:0,
                    answer:"Never",
                    isSelected: false,
                },
                {
                    id:1,
                    answer:"Sheldom",
                    isSelected: true,
                },
                {
                    id:2,
                    answer:"Quite often",
                    isSelected: false,
                },
                {
                    id:3,
                    answer:"Very often",
                    isSelected: false,
                },
                {
                    id:4,
                    answer:"Always",
                    isSelected: false,
                }
            ],
            timestamp: Date.now(),
        },
        { 
            sender: "Juan",
            role: "user",
            message: "Sheldom.",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "Make some sport every week.",
            video: require("@/assets/videos/skater.mp4"),
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "This will help you with your stress.",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "Also just take some time to relax, for example go and see the ocean.",
            video: require("@/assets/videos/sea.mp4"),
            timestamp: Date.now(),
        },
        { 
            sender: "Juan",
            role: "user",
            message: "Yes, I know that. But How else I can do to my pain?",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "this is a question",
            question:"How do you describe your pain in a scale 0(no pain at all) to 10(I can not handle it any more)?",
            answers:[
                {
                    id:0,
                    isSelected: false,
                },
                {
                    id:1,
                    isSelected: false,
                },
                {
                    id:2,
                    isSelected: false,
                },
                {
                    id:3,
                    isSelected: false,
                },
                {
                    id:4,
                    isSelected: false,
                },
                {
                    id:5,
                    isSelected: false,
                },
                {
                    id:6,
                    isSelected: false,
                },
                {
                    id:7,
                    isSelected: false,
                },
                {
                    id:8,
                    isSelected: false,
                },
                {
                    id:9,
                    isSelected: true,
                },
                {
                    id:10,
                    isSelected: false,  
                }
            ],
            timestamp: Date.now(),
        },
        { 
            sender: "Juan",
            role: "user",
            message: "9",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "Just imagen to be alone in a open field ...",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Eiche_bei_Graditz.jpg/1280px-Eiche_bei_Graditz.jpg",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "Be water my friend",
            video: require("@/assets/videos/pouring.mp4"),
            timestamp: Date.now(),
        },
        { 
            sender: "Juan",
            role: "user",
            message: "Okay",
            timestamp: Date.now(),
        },
       
    ];

    return {
        user: getChatUser(),
        history: testMessages,
        awaitingResponse: false,
        scrolling: false,
        send: sendChatMessage,
        reset: resetChatState,
        landingInfo: {},
    }
}

function resetChatState(to_message?: number)
{
    console.debug("Resetting chat state");

    Chat.user = getChatUser();
    Chat.awaitingResponse = false;
    Chat.scrolling = false;

    let spliceStart = 0;

    if(to_message)
    {
        const index = Chat.history.findIndex(x => x.timestamp === to_message);
        if(index > 0)
            spliceStart = index;
    }
    
    Chat.history = Chat.history.slice(0, spliceStart);
    console.debug(Chat, spliceStart);

    if(Chat.history.length === 0)
        Chat.history.push(systemGreeting());
}
