// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { SessionStatsEvent, StatisticsEventBase } from "@/models/statistics";
import { AireServices, AireStatisticsEvent, AireStatus } from "aire";
import { DateTime } from "luxon";
import { reactive } from "vue";

const SESSION_UPDATE_INTERVAL = 60 * 1000;

export class StatisticsContext {
    session?: SessionStatsEvent;

    public async startSession(user_id: string | undefined, auto_update: boolean = true) {
        this.session = new SessionStatsEvent(user_id);

        await this.sendEvent(this.session)
            .then(event => {
                if (event && this.session)
                    this.session.id = event.id;
            })

        if (auto_update)
            setTimeout(() => this.updateSession(auto_update), SESSION_UPDATE_INTERVAL);
    }

    public async updateSession(schedule_next_update: boolean = true) {
        if (!this.session)
            return;

        this.session.duration_minutes = DateTime.utc().diff(this.session.ts).as("minutes");

        await this.updateEvent(this.session);

        if (schedule_next_update)
            setTimeout(() => this.updateSession(schedule_next_update), SESSION_UPDATE_INTERVAL);
    }

    public async sendEvent(event: StatisticsEventBase): Promise<AireStatisticsEvent | undefined> {
        return await AireServices.Memory?.postStatisticsEvent(event)
            .then(result => {
                if (result.status == AireStatus.Success && result.data) {
                    console.debug("Statistics event sent", result.data);
                    return result.data;
                }
                else {
                    console.error("Failed to send statistics event", event);
                    return undefined;
                }
            })
            .catch(err => {
                console.error("Error while trying to send statistics event", event, err);
                return undefined;
            })
    }

    public async updateEvent(event: StatisticsEventBase): Promise<AireStatisticsEvent | undefined> {
        if (!event.id)
            return undefined;

        return await AireServices.Memory?.updateStatisticsEvent(event)
            .then(result => {
                if (result.status == AireStatus.Success && result.data) {
                    console.debug("Statistics event updated", result.data);
                    return result.data;
                }
                else {
                    console.error("Failed to update statistics event", event);
                    return undefined;
                }
            })
            .catch(err => {
                console.error("Error while trying to update statistics event", event, err);
                return undefined;
            })
    }
}

const context = reactive(new StatisticsContext());

export default function useStatistics() {
    return context;
}
