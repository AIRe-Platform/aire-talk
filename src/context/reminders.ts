// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { reactive } from "vue";
import { AireReminder, AireServices, AireStatus } from "aire";
import useAireMemory from "./memory";

export class ReminderContext {
    reminderSourceCache: { [key: string]: string } = {};

    public async getReminders(active_only: boolean): Promise<AireReminder[]> {
        const reminders = Array<AireReminder>();
        AireServices.Memories?.forEach(async memory => {
            await memory.getReminders(active_only)
                .then(x => {
                    if (x.data) {
                        x.data.forEach(item => {
                            this.reminderSourceCache[item.id!] = memory.id
                            reminders.push(item)
                        })
                    }
                })
                .catch(err => console.warn("Failed to fetch reminders from " + memory.id, err))
        });
        return reminders;
    }

    public async getReminder(id: string): Promise<AireReminder | undefined> {
        const memory = useAireMemory().agentMemory();
        return await memory?.getReminder(id).then(res => res.data);
    }

    public async editReminder(reminder: AireReminder): Promise<AireReminder | undefined> {
        if (reminder.id) {
            const source = this.reminderSourceCache[reminder.id];
            if (source) {
                const memory = useAireMemory().getMemory(source);
                return await memory?.editReminder(reminder).then(res => res.data);
            }
        }
        return undefined;
    }

    public async deleteReminder(id: string): Promise<boolean> {
        const source = this.reminderSourceCache[id];
        if (source) {
            const memory = useAireMemory().getMemory(source);
            return await memory?.deleteReminder(id).then(res => res === AireStatus.Success) ?? false;
        }
        return false;
    }
}

const context: ReminderContext = reactive(new ReminderContext());

export default function useReminders() {
    return context;
}