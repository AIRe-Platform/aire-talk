// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import useQuestionnaire from "@/context/questionnaire";
import { createInstructionMessage, createQuestionnaireMessage } from "@/helpers/chatMessages";
import i18n, { l } from "@/locales";
import { Questionnaire } from "@/models/questionnaire";
import {
    AireQuestion,
    AireQuestionOptionCheckbox,
    AireQuestionOptionType,
    AireQuestionnaireAnswer,
} from "aire";
import QuestionnaireController from "./questionnaireController";
import { openInNewTab } from "@/helpers/linkUtils";
import useChat from "@/context/chat";
import useStatistics from "@/context/statistics";
import useLogin from "@/context/login";
import { SurveyEvent, SurveyEventName } from "@/models/statistics";

const ExternalQuestionnaireController: QuestionnaireController = {
    onStart: (self: Questionnaire) => {
        const q: AireQuestion = {
            id: self.id + "_start",
            prompt: "",
            question: i18n.global.t(l.confirm_questionnaire_start, [self.name]),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            options: {
                multiselect: false,
                values: [
                    i18n.global.t(l.button_yes),
                    i18n.global.t(l.button_no)
                ]
            } as AireQuestionOptionCheckbox
        }
        return createQuestionnaireMessage(self.id + "_start", q, self.is_feedback!);
    },
    onAnswer: (self: Questionnaire, question: AireQuestionnaireAnswer, answer: any) => {
        const context = useQuestionnaire();

        if (!answer.includes(i18n.global.t(l.button_yes)))
            context.reset();

        if (self.external_url) {
            openInNewTab(self.external_url);
        }

        context.endQuestionnaire();
    },
    onComplete: (self: Questionnaire) => {
        const chat = useChat();
        const statistics = useStatistics();
        const user = useLogin();
        const context = useQuestionnaire();

        statistics.sendEvent(new SurveyEvent(
            SurveyEventName.Open,
            self.name,
            self.external_url ?? "",
            chat.id,
            user.user?.uuid,
            statistics.session?.id
        ));

        context.reset();
        return createInstructionMessage("The user opened the external survey.");
    },
}

export default ExternalQuestionnaireController;
