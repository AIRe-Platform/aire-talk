// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { AireQuestion, AireQuestionnaireAnswer } from "aire";

export enum QuestionnaireControlFlow 
{
    Default = "default",
    PersonalInfo = "personal_info",
    RecallConversations = "recall_conversations"
}

export interface Questionnaire {
    id: string;
    name: string;
    queue: Array<AireQuestion>;
    answers: Array<AireQuestionnaireAnswer>;
    controller_type: QuestionnaireControlFlow;
    completed: boolean;
}
