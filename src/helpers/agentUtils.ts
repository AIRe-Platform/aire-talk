// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import useChat from "@/context/chat";
import { AireServices } from "aire";

export function getAgentLocalized(name: string, lang: string): string | undefined {
    const chat = useChat();
    if (AireServices.Agents) {
        const agent = AireServices.Agents.find(x => x.name === name);
        if (agent?.labels && agent.labels[lang] !== "")
            return agent.labels[lang];
    }
    return undefined;
}
