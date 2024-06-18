import {
    AireChatMetadata,
    AireQuestion,
    AireQuestionOptionCheckbox,
    AireQuestionOptionType,
    AireQuestionnaireAnswer,
    AireServices,
} from "aire";
import i18n, { l } from "@/locales";
import useChat from "@/context/chat";
import { Questionnaire, QuestionnaireControlFlow } from "@/models/questionnaire";
import { createInstructionMessage, createQuestionnaireMessage } from "@/helpers/chatMessages";
import { getAnsweredQuestions } from "@/helpers/questionnaireUtils";
import useQuestionnaire from "@/context/questionnaire";
import QuestionnaireController from "./questionnaireController";
import { getAllChats } from "@/helpers/chatUtils";
import { ChatState } from "@/models/chat";

const ReminderController: QuestionnaireController = {
    onStart: (self: Questionnaire) => {
        const q: AireQuestion = {
            id: "reminder_start",
            prompt: "",
            question: i18n.global.t(l.reminder_start_question),
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
        return createQuestionnaireMessage("reminder", q);
    },
    onAnswer: (self: Questionnaire, question: AireQuestionnaireAnswer, answer: any) => {
        const context = useQuestionnaire();
        const chat = useChat();

        if (question.question_id === "reminder_start") {
            if (answer.includes(i18n.global.t(l.button_accept))) {
                context.nextQuestion();
            }
            else {
                context.reset();
            }
        }
        else if (question.question_id === "reminder_end") {
            const answers = getAnsweredQuestions("reminder");

            const keywordsAnswer = answers.find(x => x.question_id === "reminder-keywords" && x.answer?.length > 0) as AireQuestionnaireAnswer
            const summaryAnswers = answers.filter(x => x.question_id.startsWith("summary") && x.answer === i18n.global.t(l.button_accept)) as AireQuestionnaireAnswer[]

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
            id: "reminder_end",
            question: i18n.global.t(l.confirm_questionnaire_completion),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            prompt: "",
            options: {
                multiselect: false,
                values: [i18n.global.t(l.button_continue)]
            } as AireQuestionOptionCheckbox,
        };
        return createQuestionnaireMessage("reminder", q);
    }
}

export default ReminderController;

export async function createReminderQuestionnaire(): Promise<Questionnaire | undefined> {
    const questions = Array<AireQuestion>();
    const foundKeywords = Array<string>();
    const foundSummaries = Array<string>();

    const allChats = await getAllChats();
    const loadedChats = await loadChatMessages(allChats)

    loadedChats.forEach((chatLog) => {
        const state = (chatLog?.state || {}) as ChatState;
        if (state.keywords) {
            state.keywords.forEach((keyword) => {
                if (!foundKeywords.includes(keyword)) {
                    foundKeywords.push(keyword)
                }
            })
        }
        if (state.summary) {
            if (!foundSummaries.includes(state.summary)) {
                foundSummaries.push(state.summary)
            }
        }
    })

    if (foundKeywords.length > 0) {
        questions.push({
            id: "reminder-keywords",
            prompt: "[User would like to talk about these keyword topics: ",
            question: i18n.global.t(l.reminder_keyword_question),
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
            id: "summary-" + index,
            prompt: `[User would like to talk about this previous chat that was summarized as following:\n${summary}]`,
            question: i18n.global.t(l.reminder_summary_question) + ` "${summary}"`,
            type: AireQuestionOptionType.Checkbox,
            required: true,
            options: {
                multiselect: false,
                values: [
                    i18n.global.t(l.button_accept),
                    i18n.global.t(l.button_cancel)
                ]
            } as AireQuestionOptionCheckbox
        })
    })

    const questionnaire: Questionnaire = {
        id: "reminder",
        name: "Reminder",
        queue: questions,
        answers: [],
        controller_type: QuestionnaireControlFlow.Reminder,
        completed: false
    };

    if (foundKeywords.length > 0 && foundSummaries.length > 0)
        return questionnaire
    else return undefined;
}

async function loadChatMessages(chatlogs: AireChatMetadata[], amount: number = 10) {
    const loadedChats = chatlogs.slice(0, amount).map(async (x) => {
        if (AireServices.Memory) {
            return (await AireServices.Memory.getChat(x.id)).data
        }
        else {
            console.error("Memory service is not available")
        }
    })

    return await Promise.all(loadedChats)
}