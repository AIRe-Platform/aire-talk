// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { AireQuestionOptionCheckbox, AireQuestionOptionType, AireQuestionnaireAnswer } from "aire";
import { createInstructionMessage } from "./chatMessages";
import useQuestionnaire from "@/context/questionnaire";
import useChat from "@/context/chat";

export function checkAnswerForRedFlag(qa: AireQuestionnaireAnswer): boolean {
    if (qa.type == AireQuestionOptionType.Checkbox) {
        if (qa.answer == (qa.options as AireQuestionOptionCheckbox).red_flag) {
            return true;
        }
    }
    return false;
}

export function triggerRedFlag() {
    const instructions = `
    [Tell user that what they just answered is a red flag and alarming. Refuse to give further instructions because user needs urgent medical attention and tell the user to go to doctor as soon as possible. Also end the message with [RED_FLAG]]
    `
    const msg = createInstructionMessage(instructions)

    const questionnaire = useQuestionnaire();
    questionnaire.reset();

    const chat = useChat();
    chat.push(msg);
    chat.forceResponse();
}
