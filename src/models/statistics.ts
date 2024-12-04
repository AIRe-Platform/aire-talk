// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { getUILanguage } from "@/locales";
import { AireStatisticsEvent } from "aire";
import { DateTime } from "luxon";

// Flexible base class for statistics data, derive your own classes from this
export class StatisticsEventBase implements AireStatisticsEvent {
    public id?: string | undefined;
    public ts: DateTime;
    public event_name: string;
    public client_id?: string | undefined;
    public client_ver?: string | undefined;
    [x: string]: any;

    constructor(event_name: string) {
        this.event_name = event_name;
        this.ts = DateTime.utc();
        this.client_id = import.meta.env.VITE_AIRE_CLIENT_ID;
        this.client_ver = import.meta.env.VITE_COMMIT_HASH;
        this.ui_language = getUILanguage().value;
    }
}

export class SessionStatsEvent extends StatisticsEventBase {
    duration_minutes: number;

    constructor() {
        super("session");
        this.duration_minutes = 0;
    }
}

export enum ActionName {
    LoggedIn = "logged-in",
    SignUp = "sign-up",
    NewChat = "new-chat",
    ThemeLight = "theme-light",
    ThemeDark = "theme-dark",
    //? Add actions here
}

export class ActionEvent extends StatisticsEventBase {
    action: ActionName;

    constructor(action: ActionName) {
        super("action");
        this.action = action;
    }
}

export class ChatStatsEvent extends StatisticsEventBase {
    theme_added: number = 0;
    theme_removed: number = 0;
    summary_accepted: number = 0;
    summary_rejected: number = 0;
    enabled_tts: number = 0;
    disabled_tts: number = 0;
    enabled_stt: number = 0;
    disabled_stt: number = 0;
    bubble_tts_play: number = 0;
    token_count: number = 0;
    messages_sent: number = 0;
    content_suggestions: number = 0;
    questionnaires: number = 0;
    reminders: number = 0;
    errors: number = 0;

    constructor() {
        super("chat-stats");
    }
}

export class ResponseTimeEvent extends StatisticsEventBase {
    response_time_ms: number;

    constructor(response_time_ms: number) {
        super("response-time");
        this.response_time_ms = response_time_ms;
    }
}

export class FeedbackEvent extends StatisticsEventBase {
    constructor(data: { [key: string]: any }) {
        super("feedback");
        Object.keys(data).forEach(x => {
            if (!this[x])
                this[x] = data[x];
        })
    }
}

export class SurveyResultsEvent extends StatisticsEventBase {
    constructor(data: { [key: string]: any }) {
        super("survey-results");
        Object.keys(data).forEach(x => {
            if (!this[x])
                this[x] = data[x];
        })
    }
}
