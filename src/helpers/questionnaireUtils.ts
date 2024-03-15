import { AireQuestion, AireQuestionnaire, AireQuestionnaireAnswer } from "aire";

export function getRelevantQuestions(questionnaire: AireQuestionnaire, keywords: string[]): AireQuestion[] {
    const questions = questionnaire.content.flatMap(x => {
        let match_content = x.keywords === undefined;
        if (x.keywords)
            x.keywords.forEach(k => match_content = keywords.includes(k) || match_content)

        if (match_content) {
            return x.questions.filter(q => {
                let match_question = q.keywords === undefined;
                if (q.keywords)
                    q.keywords.forEach(k => match_question = keywords.includes(k) || match_content)
                return match_question
            })
        }
        return []
    })
    return questions;
}

export function getUnansweredQuestions(questions: AireQuestion[], answers: AireQuestionnaireAnswer[]): AireQuestion[] {
    return questions.filter(q => {
        const ans = answers.find(a => a.question_id == q.id)
        return (ans === undefined)
    })
}
