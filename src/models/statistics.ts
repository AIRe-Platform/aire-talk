// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { getUILanguage } from "@/locales";
import { AireSettings, AireStatisticsEvent } from "aire";
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
        this.instance_id = AireSettings.PlatformName;
    }
}

export class SessionStatsEvent extends StatisticsEventBase {
    duration_minutes: number;

    constructor(public user_id: string | undefined) {
        super(`${EventPrefix.Session}duration_minutes`);
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
    user_id?: string;
    instance_id?: string;
    chat_id?: string;
    themes?:  string;
    answer?: any;
    question?: string;
    session_id?: string;

    constructor(name: string, chat_id: string | undefined, user_id: string | undefined, answer: any, question: string, session_id: string | undefined, themes: string) {
        super("feedback." + name);
        this.chat_id = chat_id;
        this.user_id = user_id;
        this.answer = answer;
        this.question = question;
        this.session_id = session_id;
        this.themes = themes;
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

enum EventPrefix {
    Chat = "chat.",
    Configuration = "configuration.",
    Content = "content.",
    Reminder = "reminder.",
    Session = "session.",
}

export enum SessionEventName {
    Start = "start",
    End = "end",
    ActiveDuration = "active_duration",
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
        public reminder_topic: string | undefined,
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
    ) {
        super("chat.summary_accept");
    }
}
