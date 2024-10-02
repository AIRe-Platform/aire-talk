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

    // A message signifying the continuation of convesation
    ContinueConversation = "continue_conversation",

    // Message notifying of identified keyword/theme
    // The actual (hidden) content is a prompt to guide the chatbot.
    Keyword = "keyword",

    // The message contains instructions for the chatbot
    Instruction = "instruction",

    // The message contains the summary of the conversation
    Summary = "summary",

    // The message contains an error message
    Error = "error",

    // The message contains a questionnaire prompt
    Questionnaire = "questionnaire"
}

export interface ChatMessage extends AireChatMessage {
    id: string;
    sender: string;
    localize?: boolean;
}

export interface ChatStats {
    token_count?: number;
}

export interface ChatState {
    questionnaire?: Questionnaire;
    summary?: string;
    topic?: Topic;
    keyword_blacklist?: string[];
}
