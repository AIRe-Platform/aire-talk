// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { ChatMessage } from "@/models/chat";
import { Questionnaire } from "@/models/questionnaire";
import { AireQuestionnaireAnswer } from "aire";

export default interface QuestionnaireController
{
    onStart: (self: Questionnaire) => ChatMessage;
    onAnswer: (self: Questionnaire, question: AireQuestionnaireAnswer, answer: any) => void;
    onComplete: (self: Questionnaire) => ChatMessage;
}
