// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { reactive } from "vue";
import useChat from "./chat";
import { AireMemory, AireModuleAccess, AireModuleType, AireServices } from "aire";
import useLogin from "./login";

export class MemoryContext {
    public get(id: string): AireMemory | undefined {
        return AireServices.Memories?.find(x => x.id === id);
    }

    public platformDefault(): AireMemory | undefined {
        return AireServices.Memories?.at(0);
    }

    public agent(agent_name?: string): AireMemory[] {
        const chat = useChat();
        agent_name ??= chat.state.agent;

        if (agent_name) {
            const agent = AireServices.Agents?.find(x => x.name === agent_name);
            return agent?.memories
                .map(x => AireServices.Memories?.find(y => x === y.id))
                .filter(x => x !== undefined) || [];
        }

        return [];
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
        ];
    }

    public internal(): AireMemory[] {
        return AireServices.Memories || [];
    }

    public all(): AireMemory[] {
        return [
            ... this.internal(),
            ... this.external()
        ];
    }

    public async aggregate<T>(services: AireMemory[], func: (memory: AireMemory) => Promise<T[]>): Promise<T[]> {
        const tasks = services.map(async mem => await func(mem));
        const completed = await Promise.all(tasks);
        return completed.flatMap(x => x);
    }
}

const context: MemoryContext = reactive(new MemoryContext());

export default function useAireMemory() {
    return context;
}