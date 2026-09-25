// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import {
    AireQuestion,
    AireQuestionOptionCheckbox,
    AireQuestionOptionType,
    AireQuestionnaireAnswer,
} from "aire";
import i18n, { l } from "@/locales";
import useChat from "@/context/chat";
import { Questionnaire, QuestionnaireControlFlow } from "@/models/questionnaire";
import { createInstructionMessage, createQuestionnaireMessage } from "@/helpers/chatMessages";
import { getAnsweredQuestions } from "@/helpers/questionnaireUtils";
import useQuestionnaire from "@/context/questionnaire";
import QuestionnaireController from "./questionnaireController";
import { listKeywordsFromChat } from "@/helpers/chatUtils";
import { useChatCache } from "@/context/cache";

const RecallController: QuestionnaireController = {
    onStart: (self: Questionnaire) => {
        const q: AireQuestion = {
            id: "recall_start",
            prompt: "",
            question: i18n.global.t(l.recall_start_question),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            options: {
                multiselect: false,
                values: [
                    i18n.global.t(l.button_yes),
                    i18n.global.t(l.button_no)
                ]
            } as AireQuestionOptionCheckbox
        };
        return createQuestionnaireMessage("recall", self.privacy, q, false);
    },
    onAnswer: (self: Questionnaire, question: AireQuestionnaireAnswer, answer: any) => {
        const context = useQuestionnaire();
        const chat = useChat();

        if (question.question_id === "recall_start" && question.options) {
            const options = question.options as AireQuestionOptionCheckbox;
            if (answer.includes(options.values[0])) {
                context.nextQuestion();
            }
            else {
                context.reset();
            }
        }
        else if (question.question_id === "recall_end") {
            const answers = getAnsweredQuestions("recall");

            const keywordsAnswer = answers.find(x => x.question_id === "recall-keywords" && x.answer?.length > 0) as AireQuestionnaireAnswer
            const summaryAnswers = answers.filter(x => {
                if (!x.question_id.startsWith("recall-summary-") || !x.options)
                    return false;

                const options = question.options as AireQuestionOptionCheckbox;
                return x.answer.includes(options.values[0]);
            }) as AireQuestionnaireAnswer[]

            let instructions = "";
            if (keywordsAnswer)
                instructions += keywordsAnswer.prompt + keywordsAnswer.answer + "]";

            instructions += "\n";

            summaryAnswers.forEach(summaryAnswer => {
                instructions += summaryAnswer.prompt + "\n"
            })

            context.reset();

            const message = createInstructionMessage(instructions);
            chat.push(message);
            chat.forceResponse();
        }
        else {
            question.answer = answer;
            chat.autoSave();

            const hasNext = context.nextQuestion();
            if (!hasNext) {
                context.endQuestionnaire();
            }
        }
    },
    onComplete: (self: Questionnaire) => {
        const q: AireQuestion = {
            id: "recall_end",
            question: i18n.global.t(l.confirm_questionnaire_completion),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            prompt: "",
            options: {
                multiselect: false,
                values: [i18n.global.t(l.button_continue)]
            } as AireQuestionOptionCheckbox,
        };
        return createQuestionnaireMessage("recall", self.privacy, q, false);
    }
}

export default RecallController;

export async function createRecallQuestionnaire(): Promise<Questionnaire | undefined> {
    const questions = Array<AireQuestion>();
    const foundKeywords = Array<string>();
    const foundSummaries = Array<string>();
    const cache = useChatCache();

    cache.keys().forEach(key => {
        const chatlog = cache.get(key);
        if (!chatlog)
            return;

        const keywords = listKeywordsFromChat(key);
        keywords.forEach(x => {
            if (!foundKeywords.includes(x))
                foundKeywords.push(x);
        })

        if (chatlog.state?.summary) {
            foundSummaries.push(chatlog.state.summary)
        }
    })

    if (foundKeywords.length > 0) {
        questions.push({
            id: "recall-keywords",
            prompt: "[User would like to talk about these themes: ",
            question: i18n.global.t(l.recall_keyword_question),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            options: {
                multiselect: true,
                values: foundKeywords
            } as AireQuestionOptionCheckbox
        })
    }

    foundSummaries.forEach((summary, index) => {
        questions.push({
            id: "recall-summary-" + index,
            prompt: `[User would like to talk about this previous chat that was summarized as following:\n${summary}]`,
            question: i18n.global.t(l.recall_summary_question) + `\n\n"${summary}"`,
            type: AireQuestionOptionType.Checkbox,
            required: true,
            options: {
                multiselect: false,
                values: [
                    i18n.global.t(l.button_yes),
                    i18n.global.t(l.button_no)
                ]
            } as AireQuestionOptionCheckbox
        })
    })

    const questionnaire: Questionnaire = {
        id: "recall",
        name: "Recall previous conversations",
        queue: questions,
        answers: [],
        controller_type: QuestionnaireControlFlow.RecallConversations,
        completed: false,
        memory: "",
    };

    if (foundKeywords.length > 0 || foundSummaries.length > 0)
        return questionnaire
    else return undefined;
}
