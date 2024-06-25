import useSummary from "@/context/summary";
import {
    AireQuestion,
    AireQuestionnaire,
    AireQuestionnaireAnswer,
    AireServices,
} from "aire";
import useChat from "@/context/chat";
import { Questionnaire, QuestionnaireControlFlow } from "@/models/questionnaire";
import { getUILanguage } from "@/locales";

/**
 * Build a questionnaire object from the AIRe questionnaire model
 * @param model Questionnaire model
 * @returns Object representing questionnaire state
 */
export function createQuestionnaire(model: AireQuestionnaire): Questionnaire | undefined {
    if(!model.id)
        return undefined;

    const summary = useSummary();
    const questions = getRelevantQuestions(model, [...summary.keywords]);
    const answers = getAnsweredQuestions(model.id);
    const unanswered = getUnansweredQuestions(questions, answers);

    if (unanswered.length === 0)
        return;

    return {
        id: model.id,
        name: model.name,
        queue: unanswered,
        answers: [],
        controller_type: QuestionnaireControlFlow.Default,
        completed: false
    };
}

/**
 * Query questionnaires with current keywords and 
 * prompt user to start the questionnaire (if a questionnaire was found)
 */
export async function queryQuestionnaire(
    keywords: string[] | undefined = undefined
): Promise<AireQuestionnaire | undefined>  {
    if(!keywords) {
        const summary = useSummary();
        keywords = [...summary.keywords];
    }

    if (keywords.length < 1)
        return;

    if (!AireServices.Memory) {
        console.error("Memory service is not available");
        return;
    }
    const lang = getUILanguage();
    const query = await AireServices.Memory.queryQuestionnaire(keywords, lang);

    if (!query.data)
        return;

    return query.data;
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
