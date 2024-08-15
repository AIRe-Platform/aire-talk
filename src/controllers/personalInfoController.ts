// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import {
    AireQuestion,
    AireQuestionOptionCheckbox,
    AireQuestionOptionNumber,
    AireQuestionOptionOpen,
    AireQuestionOptionType,
    AireQuestionnaireAnswer,
    AireServices,
    AireUser
} from "aire";
import i18n, { l } from "@/locales";
import useChat from "@/context/chat";
import useLogin from "@/context/login";
import { Questionnaire, QuestionnaireControlFlow } from "@/models/questionnaire";
import { createInstructionMessage, createQuestionnaireMessage } from "@/helpers/chatMessages";
import { getAnsweredQuestions } from "@/helpers/questionnaireUtils";
import useQuestionnaire from "@/context/questionnaire";
import QuestionnaireController from "./questionnaireController";


const PersonalInfoController: QuestionnaireController = {
    onStart: (self: Questionnaire) => {
        const q: AireQuestion = {
            id: "personal_info_start",
            prompt: "",
            question: i18n.global.t(l.profile_question_confirm),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            options: {
                multiselect: false,
                values: [
                    i18n.global.t(l.button_accept),
                    i18n.global.t(l.button_cancel)
                ]
            } as AireQuestionOptionCheckbox
        };
        return createQuestionnaireMessage("personal_info", q);
    },
    onAnswer: (self: Questionnaire, question: AireQuestionnaireAnswer, answer: any)  =>  {
        const context = useQuestionnaire();
        const chat = useChat();

        if(question.question_id === "personal_info_start") {
            if (answer.includes(i18n.global.t(l.button_accept))) {
                context.nextQuestion();
            }
            else {
                context.reset();
            }
        }
        else if (question.question_id === "personal_info_end") {
            savePersonalInformation()
                .then(() => {
                    context.reset();
                })
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
            id: "personal_info_end",
            question: i18n.global.t(l.profile_question_completion),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            prompt: "",
            options: {
                multiselect: false,
                values: [i18n.global.t(l.button_continue)]
            } as AireQuestionOptionCheckbox,
        };
        return createQuestionnaireMessage("personal_info", q);
    }
}

export default PersonalInfoController;

export function createPersonalInfoQuestionnaire(): Questionnaire | undefined {
    const fields = createPersonalInformationQuestions();
    if (fields.length < 1) {
        console.warn("Personal information already available");
        return;
    }

    const questionnaire: Questionnaire = {
        id: "personal_info",
        name: "Personal Information",
        queue: fields,
        answers: [],
        controller_type: QuestionnaireControlFlow.PersonalInfo,
        completed: false
    };

    return questionnaire;
}

async function savePersonalInformation() {
    const login = useLogin();
    if (AireServices.ID && login.user) {
        const answers = getAnsweredQuestions("personal_info");

        const info: Record<string, string> = {}
        answers.forEach(x => { info[x.question_id] = x.answer; });

        const userData: AireUser = { ...login.user, ...info };

        await login.saveProfile(userData)
            .then((result) => {
                if (result) {
                    const chat = useChat();
                    const instructions = `
                        [The user filled missing profile information. Thank user and tell how it helps you to give better responses.]
                    `;
                    const message = createInstructionMessage(instructions);
                    chat.push(message);
                    chat.forceResponse();
                }
            })
    }
}

export function createPersonalInformationQuestions(): AireQuestion[] {
    const questions = Array<AireQuestion>();
    const login = useLogin();

    if (!login.user?.first_name) {
        questions.push({
            id: "first_name",
            prompt: "",
            question: i18n.global.t(l.profile_question_first_name),
            type: AireQuestionOptionType.Open,
            required: true,
            options: {
                multiline: false
            } as AireQuestionOptionOpen
        });
    }

    if (!login.user?.last_name) {
        questions.push({
            id: "last_name",
            prompt: "",
            question: i18n.global.t(l.profile_question_last_name),
            type: AireQuestionOptionType.Open,
            required: true,
            options: {
                multiline: false
            } as AireQuestionOptionOpen
        })
    }

    if (!login.user?.age) {
        questions.push({
            id: "age",
            prompt: "",
            question: i18n.global.t(l.profile_question_age),
            type: AireQuestionOptionType.Number,
            required: true,
            options: {
                multiline: false
            } as AireQuestionOptionNumber
        })
    }

    if (!login.user?.country) {
        questions.push({
            id: "country",
            prompt: "",
            question: i18n.global.t(l.profile_question_country),
            type: AireQuestionOptionType.Open,
            required: true,
            options: {
                multiline: false
            } as AireQuestionOptionOpen
        })
    }

    if (!login.user?.gender) {
        questions.push({
            id: "gender",
            prompt: "",
            question: i18n.global.t(l.profile_question_gender),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            options: {
                multiselect: false,
                values: [
                    i18n.global.t(l.gender_male),
                    i18n.global.t(l.gender_female),
                    i18n.global.t(l.gender_other)
                ]
            } as AireQuestionOptionCheckbox
        })
    }

    return questions;
}

