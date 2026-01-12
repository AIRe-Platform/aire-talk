// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import {
    AireMemory,
    AireQuestion,
    AireQuestionnaire,
    AireQuestionnaireAnswer
} from "aire";
import useChat from "@/context/chat";
import { Questionnaire, QuestionnaireControlFlow } from "@/models/questionnaire";
import { getUILanguage } from "@/locales";
import { listChatKeywords } from "./chatUtils";
import { ChatMessageType } from "@/models/chat";
import useAireMemory from "@/context/memory";

/**
 * Build a questionnaire object from the AIRe questionnaire model
 * @param model Questionnaire model
 * @returns Object representing questionnaire state
 */
export function createQuestionnaire(model: AireQuestionnaire, source: AireMemory): Questionnaire | undefined {
    if (!model.id)
        return undefined;

    const keywords = listChatKeywords();
    const questions = getRelevantQuestions(model, keywords);
    const answers = getAnsweredQuestions(model.id);
    const unanswered = getUnansweredQuestions(questions, answers);
    const isFeedback = model.is_feedback;
    if (unanswered.length === 0)
        return;

    return {
        id: model.id,
        name: model.name,
        queue: unanswered,
        answers: [],
        controller_type: QuestionnaireControlFlow.Default,
        completed: false,
        is_feedback: isFeedback,
        memory: source.id
    };
}

/**
 * Query questionnaires with current keywords and 
 * prompt user to start the questionnaire (if a questionnaire was found)
 */
export async function queryQuestionnaire(keywords: string[]): Promise<{ source: string, result: AireQuestionnaire }[]> {
    if (keywords.length < 1)
        return [];

    const sources = useAireMemory().agent();

    return await useAireMemory().aggregate(sources, async memory => {
        const lang = getUILanguage();
        const query = await memory.queryQuestionnaire(keywords, lang.value);

        if (!query.data)
            return [];

        return [{ source: memory.id, result: query.data }];
    });
}

export async function queryQuestionnairesForKeyword(keyword: string): Promise<{ source: string, results: AireQuestionnaire[] }[]> {
    const sources = useAireMemory().agent();
    return await useAireMemory().aggregate(sources, async memory => {
        const lang = getUILanguage();
        const query = await memory.getQuestionnairesWithKeyword(keyword, lang.value);

        if (!query.data)
            return [];

        return [{ source: memory.id, results: query.data }];
    });
}

/**
 * Query feedback questionnaire
 */
export async function queryFeedbackQuestionnaire(): Promise<{ source: string, result: AireQuestionnaire }[]> {
    const sources = useAireMemory().agent();
    return await useAireMemory().aggregate(sources, async memory => {
        const lang = getUILanguage();
        const query = await memory.queryFeedbackQuestionnaire(lang.value);

        if (!query.data)
            return [];

        return [{ source: memory.id, result: query.data }];
    })
}

export function getRelevantQuestions(questionnaire: AireQuestionnaire, keywords: string[]): AireQuestion[] {
    const questions = questionnaire.content.flatMap(x => {
        let match_content = x.keywords === undefined || x.keywords.length < 1;
        if (x.keywords)
            x.keywords.forEach(k => match_content = keywords.includes(k) || match_content)

        if (match_content) {
            return x.questions.filter(q => {
                let match_question = q.keywords === undefined || q.keywords.length < 1;
                if (q.keywords)
                    q.keywords.forEach(k => match_question = keywords.includes(k) || match_content)
                return match_question
            })
        }
        return []
    })
    return questions;
}

export function getAnsweredQuestions(questionnaire_id: string): AireQuestionnaireAnswer[] {
    const chat = useChat();
    const items = chat.messages
        .filter(x => x.question && x.question?.questionnaire_id === questionnaire_id && x.question.answer)
        .map(x => x.question!);
    return items;
}

export function getUnansweredQuestions(questions: AireQuestion[], answers: AireQuestionnaireAnswer[]): AireQuestion[] {
    return questions.filter(q => {
        const ans = answers.find(a => a.question_id == q.id)
        return (ans === undefined)
    })
}

export function getChatQuestionnairesIds(): string[] {
    const chat = useChat();
    const ids = new Set<string>();
    chat.messages.forEach(x => {
        if (x.type === ChatMessageType.Questionnaire && x.question?.questionnaire_id)
            ids.add(x.question.questionnaire_id);
    })
    return [...ids];
}
