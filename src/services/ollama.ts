interface OllamaConfig {
    host: string;
    model: string;
    system?: string;
    options?: { [param: string]: string }
    stream?: boolean;
}

interface OllamaGenerateRequest {
    model: string;
    prompt: string;
    options?: { [param: string]: string }
    system?: string;
    context?: any;
    stream?: boolean;
}

interface OllamaGenerateResponse {
    model: string;
    created_at: Date;
    response: string;
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    sample_count?: number;
    sample_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
    context?: any;
}

let config: OllamaConfig;
let context: any = undefined;

export function initOllama(conf: OllamaConfig) {
    config = conf;
}

export function send(prompt: string, callback: (response: string, final: boolean) => void) {
    const req: OllamaGenerateRequest = {
        model: config.model,
        prompt: prompt.trim(),
        context: context,
        system: config.system,
        stream: config.stream
    }

    generate(req, (response: OllamaGenerateResponse) => {
        if (response.done)
            context = response.context
        callback(response.response, response.done)
    });
}

export function resetContext() {
    context = undefined;
}

async function generate(req: OllamaGenerateRequest, callback: (_: OllamaGenerateResponse) => void) {
    const response = await fetch(config.host, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    });

    const reader = response.body?.getReader();
    let done = false;
    let value: any = null;

    while (!done && reader != null) {
        ({ value, done } = await reader.read());
        const responseString = new TextDecoder().decode(value);
        if(responseString.length > 0)
        {
            const responseBody = JSON.parse(responseString) as OllamaGenerateResponse;
            callback(responseBody);
        }
    }
}
