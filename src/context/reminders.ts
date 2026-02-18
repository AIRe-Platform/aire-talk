// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { reactive } from "vue";
import { AireReminder, AireServices, AireStatus } from "aire";
import useAireMemory from "./memory";
import { useReminderCache } from "./cache";

export class ReminderContext {
    private cache = useReminderCache();

    public async getReminders(active_only: boolean): Promise<AireReminder[]> {
        const reminders = Array<AireReminder>();
        AireServices.Memories?.forEach(async memory => {
            await memory.getReminders(active_only)
                .then(x => {
                    if (x.data) {
                        x.data.forEach(item => {
                            if (item.id) {
                                this.cache.set(item.id, { origin: memory.id, reminder: item });
                                reminders.push(item)
                            }
                        })
                    }
                })
                .catch(err => console.warn("Failed to fetch reminders from " + memory.id, err))
        });
        return reminders;
    }

    public async getReminder(id: string): Promise<AireReminder | undefined> {
        const source = this.cache.get(id)?.origin;
        const sources = source ? [useAireMemory().get(source)] : useAireMemory().all();
        for (const memory of sources) {
            const reminder = await memory?.getReminder(id).then(res => res.data);
            if (reminder)
                return reminder;
        }
    }

    public async editReminder(reminder: AireReminder): Promise<AireReminder | undefined> {
        if (reminder.id) {
            const source = this.cache.get(reminder.id)?.origin;
            if (source) {
                const memory = useAireMemory().get(source);
                return await memory?.editReminder(reminder).then(res => res.data);
            }
        }
        return undefined;
    }

    public async deleteReminder(id: string): Promise<boolean> {
        const source = this.cache.get(id)?.origin;
        if (source) {
            const memory = useAireMemory().get(source);
            return await memory?.deleteReminder(id).then(res => res === AireStatus.Success) ?? false;
        }
        return false;
    }
}

const context = reactive(new ReminderContext());

export default function useReminders() {
    return context;
}
