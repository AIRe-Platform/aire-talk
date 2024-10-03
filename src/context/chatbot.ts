// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { reactive } from "vue"

type ChatbotStatus = "idle" | "writing" | "answered";

export class ChatbotContext {
    status: ChatbotStatus;

    private running_tasks: number;

    constructor() {
        this.status = "idle";
        this.running_tasks = 0;
    }

    public makeBusy(useTimeout: boolean | number = true) {
        this.running_tasks += 1;
        this.status = "writing";

        if (useTimeout) {
            const timeout_ms = (typeof useTimeout === 'number') ? useTimeout : 2000;

            setTimeout(() => {
                this.reportReady()
            }, timeout_ms);
        }
    }

    public reportReady() {
        this.running_tasks -= 1;
        if (this.running_tasks < 0)
            this.running_tasks = 0;

        if (this.running_tasks == 0) {
            this.status = "answered"

            setTimeout(() => {
                if (this.status == "answered")
                    this.status = "idle";
            }, 2000);
        }
    }
}

const context = reactive(new ChatbotContext());

export default function useChatbot() {
    return context;
}
