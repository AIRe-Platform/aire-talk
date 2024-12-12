// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import {
    AireContent,
    AireQuestion,
    AireQuestionOptionCheckbox,
    AireQuestionOptionContent,
    AireQuestionOptionNumber,
    AireQuestionOptionOpen,
    AireQuestionOptionType,
    AireQuestionnaireAnswer
} from "aire";
import i18n, { l } from "@/locales";
import useChat from "@/context/chat";
import useLogin from "@/context/login";
import { Questionnaire, QuestionnaireControlFlow } from "@/models/questionnaire";
import { createInstructionMessage, createQuestionnaireMessage } from "@/helpers/chatMessages";
import useQuestionnaire from "@/context/questionnaire";
import QuestionnaireController from "./questionnaireController";
import useStatistics from "@/context/statistics";
import { FeedbackEvent } from "@/models/statistics";
import { getAnsweredQuestions } from "@/helpers/questionnaireUtils";
import { ChatMessageType } from "@/models/chat";
import { onAcceptSummary } from "@/helpers/chatUtils";
import { getChatContentIds } from "@/helpers/contentUtils";
import useContent from "@/context/content";

const PersonalFeedbackController: QuestionnaireController = {
    onStart: (self: Questionnaire) => {
        const q: AireQuestion = {
            id: "feedback_personal_start",
            prompt: "",
            question: i18n.global.t(l.feedback_question_confirm),
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
        return createQuestionnaireMessage("feedback_personal", q);
    },
    onAnswer: (self: Questionnaire, question: AireQuestionnaireAnswer, answer: any)  =>  {
        const context = useQuestionnaire();
        const chat = useChat();

        if(question.question_id === "personal_feedback_start") {
            if (answer.includes(i18n.global.t(l.button_yes))) {
                context.nextQuestion();
            }
            else {
                context.reset();
            }
        }
        else if (question.question_id === "personal_feedback_end") {
            saveFeedbackPersonalInformation()
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
            id: "personal_feedback_end",
            question: i18n.global.t(l.feedback_question_completed),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            prompt: "",
            options: {
                multiselect: false,
                values: [i18n.global.t(l.button_continue)]
            } as AireQuestionOptionCheckbox,
        };
        return createQuestionnaireMessage("feedback_personal", q);
    }
}

export default PersonalFeedbackController;

export async function createPersonalFeedbackQuestionnaire(): Promise<Questionnaire | undefined> {
    const fields = await createPersonalFeedbackInformationQuestions();
    if (fields.length < 1) {
        console.warn("Feedback information already available");
        return;
    }

    const questionnaire: Questionnaire = {
        id: "feedback_personal",
        name: "Personal feedback Information",
        queue: fields,
        answers: [],
        controller_type: QuestionnaireControlFlow.Feedback,
        completed: false
    };

    return questionnaire;
}

async function saveFeedbackPersonalInformation() {

    const answers = getAnsweredQuestions("feedback_personal");

    const info: Record<string, string> = {}

    answers.forEach(x => { info[x.question_id] = x.answer; });

    const chat = await useChat();

    const statistics = useStatistics();

    const user = await useLogin();
    
    const themes: string[] = [];
    chat.messages.forEach( message => {
        if (message.type === ChatMessageType.Keyword && !themes.includes(message.content!)) {
            themes.push(message.content!);
        }
    });
    const themesString: string = themes.join(',');

    answers.forEach( a => {
        statistics.sendEvent(new FeedbackEvent(
                a.question_id,
                chat.id,
                user.user?.uuid,
                a.answer,
                a.question,
                statistics.session?.id,
                themesString
            ));
    });

    const instructions = `
        [The user filled a feedback questionnaire. Thank user for this feedback and tell how it will helps you and other people in the future.]
    `;
    const message = createInstructionMessage(instructions);
    chat.push(message);

    onAcceptSummary();
}

export async function createPersonalFeedbackInformationQuestions(): Promise<AireQuestion[]> {
    const questions = Array<AireQuestion>();

    questions.push({
        id: "need_identification",
        prompt: "",
        question: i18n.global.t(l.feedback_question_need_identification),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_very_litle),
                i18n.global.t(l.feedback_answer_litle),
                i18n.global.t(l.feedback_answer_normal),
                i18n.global.t(l.feedback_answer_much),
                i18n.global.t(l.feedback_answer_very_much)
            ]
        } as AireQuestionOptionCheckbox
    });

     questions.push({
        id: "target_setting",
        prompt: "",
        question: i18n.global.t(l.feedback_question_target_setting),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_very_litle),
                i18n.global.t(l.feedback_answer_litle),
                i18n.global.t(l.feedback_answer_normal),
                i18n.global.t(l.feedback_answer_much),
                i18n.global.t(l.feedback_answer_very_much)
            ]
        } as AireQuestionOptionCheckbox
    });

    questions.push({
        id: "benefited_from_content",
        prompt: "",
        question: i18n.global.t(l.feedback_question_benefited_from_content),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_very_litle),
                i18n.global.t(l.feedback_answer_litle),
                i18n.global.t(l.feedback_answer_normal),
                i18n.global.t(l.feedback_answer_much),
                i18n.global.t(l.feedback_answer_very_much)
            ]
        } as AireQuestionOptionCheckbox
    });

    questions.push({
        id: "ability_improved",
        prompt: "",
        question: i18n.global.t(l.feedback_question_ability_improved),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_very_litle),
                i18n.global.t(l.feedback_answer_litle),
                i18n.global.t(l.feedback_answer_normal),
                i18n.global.t(l.feedback_answer_much),
                i18n.global.t(l.feedback_answer_very_much)
            ]
        } as AireQuestionOptionCheckbox
    });

    questions.push({
        id: "target_reached",
        prompt: "",
        question: i18n.global.t(l.feedback_question_target_reached),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_not_at_all),
                i18n.global.t(l.feedback_answer_a_litle),
                i18n.global.t(l.feedback_answer_somewhat),
                i18n.global.t(l.feedback_answer_quite_well),
                i18n.global.t(l.feedback_answer_very_well)
            ]
        } as AireQuestionOptionCheckbox
    });

    const contentObjects = await getContents();

    if(contentObjects.length){
        questions.push({
            id: "most_useful_content",
            prompt: "",
            question: i18n.global.t(l.feedback_question_most_useful_content),
            type: AireQuestionOptionType.Content,
            required: true,
            options: {
                multiselect: false,
                contents: contentObjects
            } as AireQuestionOptionContent
        });
    }

    questions.push({
        id: "usage",
        prompt: "",
        question: i18n.global.t(l.feedback_question_usage),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_independently),
                i18n.global.t(l.feedback_answer_assistant)
            ]
        } as AireQuestionOptionCheckbox
    });

    questions.push({
        id: "occupational_group",
        prompt: "",
        question: i18n.global.t(l.feedback_question_occupational_group),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_employed),
                i18n.global.t(l.feedback_answer_unemployed),
                i18n.global.t(l.feedback_answer_student),
                i18n.global.t(l.feedback_answer_retired),
                i18n.global.t(l.feedback_answer_other)
            ]
        } as AireQuestionOptionCheckbox
    });

    questions.push({
        id: "age_group",
        prompt: "",
        question: i18n.global.t(l.feedback_question_age_group),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_1_9),
                i18n.global.t(l.feedback_answer_10_19),
                i18n.global.t(l.feedback_answer_20_29),
                i18n.global.t(l.feedback_answer_30_39),
                i18n.global.t(l.feedback_answer_40_49),
                i18n.global.t(l.feedback_answer_50_59),
                i18n.global.t(l.feedback_answer_60_69),
                i18n.global.t(l.feedback_answer_70_79),
                i18n.global.t(l.feedback_answer_80_100)
            ]
        } as AireQuestionOptionCheckbox
    });

    questions.push({
        id: "household_size",
        prompt: "",
        question: i18n.global.t(l.feedback_question_household_size),
        type: AireQuestionOptionType.Number,
        required: true,
        options: {
            multiline: false
        } as AireQuestionOptionNumber
    });

    questions.push({
        id: "can_get_support",
        prompt: "",
        question: i18n.global.t(l.feedback_question_can_get_support),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_yes),
                i18n.global.t(l.feedback_answer_no)
            ]
        } as AireQuestionOptionCheckbox
    });

    questions.push({
        id: "gender",
        prompt: "",
        question: i18n.global.t(l.feedback_question_gender),
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
    });
    
    /**
     This is too broad to be multiple-choice questions, so it should have an open text field,
    which is error prone and can have different spellings. We will skip this for now!
    
    Country
     */


    /**
     We will skip this for now! We will need a better question for this.
    Asuinpaikka
    (Taajama/Kaupunki/Haja-asutusalue)
    Place of residence

    */

    questions.push({
        id: "platform_rating",
        prompt: "",
        question: i18n.global.t(l.feedback_question_platform_rating),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_do_not_like),
                i18n.global.t(l.feedback_answer_dislike),
                i18n.global.t(l.feedback_answer_neutral),
                i18n.global.t(l.feedback_answer_like_it),
                i18n.global.t(l.feedback_answer_like_it_very_much)
            ]
        } as AireQuestionOptionCheckbox
    });

    questions.push({
        id: "todays_experience",
        prompt: "",
        question: i18n.global.t(l.feedback_question_todays_experience),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.feedback_answer_not_at_all),
                i18n.global.t(l.feedback_answer_a_litle),
                i18n.global.t(l.feedback_answer_somewhat),
                i18n.global.t(l.feedback_answer_quite_well),
                i18n.global.t(l.feedback_answer_very_well)
            ]
        } as AireQuestionOptionCheckbox
    });

    questions.push({
        id: "open_feedback",
        prompt: "",
        question: i18n.global.t(l.feedback_question_open_feedback),
        type: AireQuestionOptionType.Open,
        required: true,
        options: {
            multiline: false,
            max_len: 5000,
           
        } as AireQuestionOptionOpen
    });

    return questions;
}

export async function getContents(): Promise<AireContent[]> {
    const chat = useChat();
    const content_ids = getChatContentIds(chat.messages);

    const contentContext = useContent();
    const uniqueContentMap = new Map<string, AireContent>();

    for (const contentId of content_ids) {
        const item = await contentContext.get(contentId);
        if (item) {
            uniqueContentMap.set(contentId, item);  
        }
    }

    const contentObjects = Array.from(uniqueContentMap.values());

    return contentObjects;
}