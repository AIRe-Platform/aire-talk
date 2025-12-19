// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { reactive } from "vue";
import useChat from "./chat";
import { AireMemory, AireModuleAccess, AireModuleType, AireServices } from "aire";
import useLogin from "./login";

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

    public externalUserConnected(): AireMemory[] {
        const connected = useLogin().user?.connected_services ?? [];
        return (AireServices.ExternalServices ?? [])
            .filter(x => connected.map(s => s.service_name).includes(x.name!))
            .flatMap(x => {
                const token = connected.find(x => x.service_name)?.token;
                const modules = x.modules?.filter(
                    x =>
                        x.type === AireModuleType.Memory &&
                        x.access === AireModuleAccess.Private
                ) ?? [];
                return modules.map(x => new AireMemory(x, AireServices.ClientCredentials, token));
            });
    }

    public externalPublic(): AireMemory[] {
        return (AireServices.ExternalServices ?? [])
            .flatMap(x => {
                const modules = x.modules?.filter(
                    x =>
                        x.type === AireModuleType.Memory &&
                        x.access === AireModuleAccess.Public
                ) ?? [];
                return modules.map(x => new AireMemory(x, AireServices.ClientCredentials));
            });
    }

    public external(): AireMemory[] {
        return [
            ... this.externalUserConnected(),
            ... this.externalPublic()
        ]
    }

    public aggregate<T>(services: AireMemory[], func: (memory: AireMemory) => T[]): T[] {
        return services.map(x => func(x)).flatMap(x => x);
    }
}

const context: MemoryContext = reactive(new MemoryContext());

export default function useAireMemory() {
    return context;
}