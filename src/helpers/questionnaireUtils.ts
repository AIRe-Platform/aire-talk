import { Login } from "@/context/login";
import i18n, { l } from "@/locales";
import { AireQuestion, AireQuestionOptionCheckbox, AireQuestionOptionNumber, AireQuestionOptionOpen, AireQuestionOptionType, AireQuestionnaire, AireQuestionnaireAnswer, AireUser } from "aire";

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

export function getMissingPersonalInformationQuestions(): AireQuestion[] {
    const questions = Array<AireQuestion>();
    if(!Login.user?.first_name) {
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
    if(!Login.user?.last_name) {
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
    if(!Login.user?.age) {
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
    if(!Login.user?.country) {
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
    if(!Login.user?.gender) {
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
    // if(!Login.user?.language) {
    //     questions.push({
    //         id: "language",
    //         prompt: "",
    //         question: i18n.global.t(l.profile_question_language),
    //         type: AireQuestionOptionType.Open,
    //         required: true,
    //         options: {
    //             multiline: false
    //         } as AireQuestionOptionOpen
    //     })
    // }
    return questions;
}