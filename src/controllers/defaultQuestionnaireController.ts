// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import useChat from "@/context/chat";
import useChatbot from "@/context/chatbot";
import useQuestionnaire from "@/context/questionnaire";
import { createErrorMessage, createInstructionMessage, createQuestionnaireMessage } from "@/helpers/chatMessages";
import { checkAnswerForRedFlag, triggerRedFlag } from "@/helpers/questionnaireFlagging";
import { getAnsweredQuestions } from "@/helpers/questionnaireUtils";
import i18n, { l } from "@/locales";
import { Questionnaire } from "@/models/questionnaire";
import { AireQuestion, AireQuestionOption, AireQuestionOptionCheckbox, AireQuestionOptionType, AireQuestionnaireAnswer, AireQuestionnaireResults, AireServices, AireStatus } from "aire";
import QuestionnaireController from "./questionnaireController";
import useStatistics from "@/context/statistics";
import useLogin from "@/context/login";
import { FeedbackEvent } from "@/models/statistics";
import { ChatMessageType } from "@/models/chat";

const DefaultQuestionnaireController: QuestionnaireController = {
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

        return createQuestionnaireMessage(self.id + "_start", q);
    },
    onAnswer: (self: Questionnaire, question: AireQuestionnaireAnswer, answer: any) => {
        const context = useQuestionnaire();
        const chat = useChat();
        const statistics = useStatistics();
        const user = useLogin();
        let questionFeedbackId: string = "feedback.";
        
        if (question.question_id === `${self.id}_start`) {
            if (answer.includes(i18n.global.t(l.button_yes)))
                context.nextQuestion();
            else
                context.reset();
        }
        else if (question.question_id === `${self.id}_end`) {
            digest(self.id)
                .then(() => {
                    context.reset();
                })
        }
        else {
            question.answer = answer;
    
            const themes: string[] = [];
            chat.messages.forEach( message => {
                if (message.type === ChatMessageType.Keyword && !themes.includes(message.content!)) {
                    themes.push(message.content!);
                }
            });
            const themesString: string = themes.join(',');
            let answerIndex = null;

            if (isAireQuestionOptionCheckbox(question.options)) {
                const answerToCompare = question.answer as string | number;

                // Ensure that the answer is part of the values array (which should be an array of strings or numbers)
                answerIndex = question.options.values.indexOf(answerToCompare);

                if (answerIndex === -1) {
                    answerIndex = question.answer;
                }
            }else{
                answerIndex = question.answer;
            }
            
            statistics.sendEvent(new FeedbackEvent(
                    questionFeedbackId + question.question_id,
                    chat.id,
                    user.user?.uuid,
                    answerIndex,
                    question.question,
                    statistics.session?.id,
                    themesString
                ));

            if (checkAnswerForRedFlag(question))
                triggerRedFlag();

            const hasNext = context.nextQuestion();

            chat.autoSave();

            if (!hasNext) {
                context.endQuestionnaire();
            }
        }
    },
    onComplete: (self: Questionnaire) => {
        const q: AireQuestion = {
            id: self.id + "_end",
            question: i18n.global.t(l.confirm_questionnaire_completion),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            prompt: "",
            options: {
                multiselect: false,
                values: [i18n.global.t(l.button_continue)]
            } as AireQuestionOptionCheckbox,
        }

        return createQuestionnaireMessage(self.id + "_end", q);
    },
}

export default DefaultQuestionnaireController;

async function digest(questionnaire_id: string) {
    const chat = useChat();
    const bot = useChatbot();
    const answers = getAnsweredQuestions(questionnaire_id);

    bot.makeBusy();

    const results = await processAnswers(questionnaire_id, answers);
    if (!results) {
        const err = createErrorMessage(l.error_ai_not_responding);
        chat.push(err);
        bot.reportReady();
        return;
    }

    if (!await saveResults(results)) {
        const err = createErrorMessage(l.error_generic);
        chat.push(err);
        bot.reportReady();
        return;
    }

    let message = "";
    if (results.prompts) {
        const facts = results.prompts?.join("\n")
        message = `[The user responded to a questionnaire. Here are the facts:\n${facts}]`
    }
    else {
        message = `[The user responded to a questionnaire. Here is a summary:\n${results.summary}]`
    }

    const msg = createInstructionMessage(message);
    chat.push(msg);
    chat.forceResponse();
    bot.reportReady();
}

// Type guard to check if options are of type AireQuestionOptionCheckbox
function isAireQuestionOptionCheckbox(options: AireQuestionOption | undefined): options is AireQuestionOptionCheckbox {
    return (options as AireQuestionOptionCheckbox)?.values !== undefined;
}

async function processAnswers(id: string, answers: AireQuestionnaireAnswer[]): Promise<AireQuestionnaireResults | undefined> {
    if (!AireServices.AI) {
        console.warn("AI module is not available for LLM processing");
        return;
    }

    return await AireServices.AI.processQuestionnaire(id, answers)
        .then((result) => {
            if (result.data) {
                return result.data;
            }
            else {
                throw Error(result.status.toString());
            }
        })
        .catch((err) => {
            console.error("Failed to process questionnaire answers", err);
            return undefined;
        })
}

async function saveResults(results: AireQuestionnaireResults): Promise<boolean> {
    if (!AireServices.Memory) {
        console.warn("Memory module is not available for saving");
        return false;
    }

    return await AireServices.Memory.saveQuestionnaireResults(results)
        .then((result) => {
            if (result.status === AireStatus.Success) {
                return true;
            }
            else {
                throw Error(result.status.toString());
            }
        })
        .catch((err) => {
            console.error("Failed to save questionnaire answers", err);
            return false;
        })
}
