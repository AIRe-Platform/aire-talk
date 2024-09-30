// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { AireChatMessage } from "aire";
import { Topic } from "./topic";
import { Questionnaire } from "./questionnaire";

export enum ChatMessageType {
    // Default message style
    Default = "default",

    // A message signifying the end of conversation
    EndOfConversation = "end_of_conversation",

    // Message notifying of identified keyword/theme
    // The actual (hidden) content is a prompt to guide the chatbot.
    KeywordPrompt = "prompt_keyword",

    // Action message, activating will generate a summary
    ActionSummarize = "action_summarize",
}

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
