// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { getUILanguage } from "@/locales";
import { AireServices, AireStatisticsEvent, AireTokenStatsEvent } from "aire";
import { DateTime } from "luxon";

// Base event classes
// Event names are hierarchical
enum EventPrefix {
    Chat = "chat.",
    Configuration = "configuration.",
    Content = "content.",
    Feedback = "feedback.",
    Reminder = "reminder.",
    Session = "session.",
    Survey = "survey.",
}

// Flexible base class for statistics data, derive your own classes from this
export class StatisticsEventBase implements AireStatisticsEvent {
    public id?: string | undefined;
    public ts: DateTime;
    public event_name: string;
    public client_id?: string | undefined;
    public client_ver?: string | undefined;
    public instance_id?: string | undefined;
    [x: string]: any;

    constructor(event_name: string) {
        this.event_name = event_name;
        this.ts = DateTime.utc();
        this.client_id = import.meta.env.VITE_AIRE_CLIENT_ID;
        this.client_ver = import.meta.env.VITE_COMMIT_HASH;
        this.instance_id = AireServices.PlatformId;
        this.ui_language = getUILanguage().value;
    }
}

export class SessionStatsEvent extends StatisticsEventBase {
    constructor(
        public user_id: string | undefined,
        public session_id: string | undefined = undefined,
        public duration_minutes: number = 0,
    ) {
        super(`${EventPrefix.Session}duration_minutes`);
    }
}

export class ChatTokenStatsEvent extends StatisticsEventBase {
    total_tokens?: number;
    input_tokens?: number;
    output_tokens?: number;

    constructor(
        public chat_id: string | undefined,
        public user_id: string | undefined,
        public session_id: string | undefined,
        stats_event: AireTokenStatsEvent
    ) {
        super(`${EventPrefix.Chat}token-stats`);
        this.total_tokens = stats_event.total_tokens;
        this.input_tokens = stats_event.input_tokens;
        this.output_tokens = stats_event.output_tokens;
    }
}

export class ResponseTimeEvent extends StatisticsEventBase {
    constructor(
        public response_time_ms: number,
        public chat_id: string | undefined,
        public user_id: string | undefined,
        public session_id: string | undefined,
    ) {
        super(`${EventPrefix.Chat}response_time`);
    }
}

export class FeedbackEvent extends StatisticsEventBase {
    constructor(
        name: string,
        public chat_id: string | undefined,
        public user_id: string | undefined,
        public answer: any,
        public question: string | undefined,
        public session_id: string | undefined,
        public themes: string | undefined
    ) {
        super(`${EventPrefix.Feedback}${name}`);
    }
}

export enum SessionEventName {
    Start = "start",
    End = "end",
}

export class SessionEvent extends StatisticsEventBase {
    constructor(
        public user_id: string | undefined,
        public session_id: string | undefined,
        eventName: SessionEventName
    ) {
        super(`${EventPrefix.Session}${eventName}`);
    }
}

export enum ConfigurationEventName {
    ProfileUpdate = "user_profile_updated",
    LanguageSelected = "language_selected",
}

export class ConfigurationEvent extends StatisticsEventBase {
    constructor(
        public user_id: string | undefined,
        public session_id: string | undefined,
        eventName: ConfigurationEventName
    ) {
        super(`${EventPrefix.Configuration}${eventName}`);
    }
}

export enum ReminderEventName {
    Added = "added",
    Removed = "removed",
    ContinueConversation = "continue_conversation",
}

export class ReminderEvent extends StatisticsEventBase {
    constructor(
        public reminder_timestamp: number,
        public chat_id: string | undefined,
        public user_id: string | undefined,
        public session_id: string | undefined,
        eventName: ReminderEventName
    ) {
        super(`${EventPrefix.Reminder}${eventName}`);
    }
}

export enum ChatThemeEventName {
    ThemeAdded = "theme_added",
    ThemeRemoved = "theme_removed",
    ThemeConfirmed = "theme_confirmed",
}

export class ChatThemeEvent extends StatisticsEventBase {
    constructor(
        public theme_name: string,
        public chat_id: string | undefined,
        public user_id: string | undefined,
        public session_id: string | undefined,
        eventName: ChatThemeEventName
    ) {
        super(`${EventPrefix.Chat}${eventName}`);
    }
}

export enum ContentEventName {
    Showed = "showed",
    Opened = "opened",
    Liked = "liked",
    Disliked = "disliked",
}

export enum ContentEventAction {
    ModalOpen = "modal opened",
    LinkOpen = "link opened",
}

export class ContentEvent extends StatisticsEventBase {
    constructor(
        public content_id: string | undefined,
        public content_name: string | undefined,
        public theme_names: string,
        public chat_id: string | undefined,
        public user_id: string | undefined,
        public session_id: string | undefined,
        eventName: ContentEventName,
        action?: ContentEventAction
    ) {
        super(`${EventPrefix.Content}${eventName}`);
        if (action)
            this.action = action;
    }
}

export class ChatSummaryAcceptEvent extends StatisticsEventBase {
    constructor(
        public token_count: number | undefined,
        public theme_names: string,
        public chat_id: string | undefined,
        public user_id: string | undefined,
        public session_id: string | undefined,
        public summary: string | undefined,
    ) {
        super(`${EventPrefix.Chat}summary_accept`);
    }
}

export enum SurveyEventName {
    Open = "open"
}

export class SurveyEvent extends StatisticsEventBase {
    constructor(
        eventName: SurveyEventName,
        public survey_name: string,
        public external_url: string,
        public chat_id: string | undefined,
        public user_id: string | undefined,
        public session_id: string | undefined,

    ) {
        super(`${EventPrefix.Survey}${eventName}`)
    }
}
