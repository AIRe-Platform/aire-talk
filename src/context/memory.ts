// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { reactive } from "vue";
import useChat from "./chat";
import { AireMemory, AireServices } from "aire";

export class MemoryContext {
    public agentMemory(agent_name?: string): AireMemory | undefined {
        const chat = useChat();
        agent_name ??= chat.state.agent;

        if (agent_name) {
            const agent = AireServices.Agents?.find(x => x.name === agent_name);
            const agentMemory = agent?.memories.at(0);
            if (agentMemory) {
                return AireServices.Memories?.find(x => x.id === agentMemory);
            }
        }

        return undefined;
    }

    public defaultMemory(): AireMemory | undefined {
        return AireServices.Memories?.at(0);
    }

    public agentOrDefaultMemory(agent_name?: string): AireMemory | undefined {
        return this.agentMemory(agent_name) ?? this.defaultMemory();
    }

    public getMemory(id: string): AireMemory | undefined {
        return AireServices.Memories?.find(x => x.id === id);
    }
}

const context: MemoryContext = reactive(new MemoryContext());

export default function useAireMemory() {
    return context;
}