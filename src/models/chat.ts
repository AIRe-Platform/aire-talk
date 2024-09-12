// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { AireChatMessage } from "aire";
import { Topic } from "./topic";
import { Questionnaire } from "./questionnaire";

export interface ChatMessage extends AireChatMessage {
    id: string;
    sender: string;
    isError?: boolean;
    localize?: boolean;
}
export interface ChatStats {
    token_count?: number;
}

export interface ChatState {
    questionnaire?: Questionnaire;
    summary?: string;
    keywords?: Array<string>;
    topic?: Topic;
}
