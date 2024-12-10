// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { reactive } from "vue";
import useChat from "./chat";
import { Questionnaire, QuestionnaireControlFlow } from "@/models/questionnaire";
import {
    createQuestionnaireMessage
} from "@/helpers/chatMessages";
import PersonalInfoController from "@/controllers/personalInfoController";
import QuestionnaireController from "@/controllers/questionnaireController";
import DefaultQuestionnaireController from "@/controllers/defaultQuestionnaireController";
import RecallController from "@/controllers/recallController";
import PersonalFeedbackController from "@/controllers/questionnaireEventsController";

const controllers = new Map<QuestionnaireControlFlow, QuestionnaireController>([
    [ QuestionnaireControlFlow.Default, DefaultQuestionnaireController ],
    [ QuestionnaireControlFlow.PersonalInfo, PersonalInfoController],
    [ QuestionnaireControlFlow.Feedback, PersonalFeedbackController],
    [ QuestionnaireControlFlow.RecallConversations, RecallController]
]);

export class QuestionnaireContext {
    public active?: Questionnaire;
    private controller?: QuestionnaireController;

    constructor() { }

    public reset() {
        if(this.active && !this.active.completed) {
            const chat = useChat();
            const last_message = chat.messages.findLast(x => x.question == undefined);
            if(last_message) {
                chat.revertTo(last_message.id, false);
            }
        }
        this.active = undefined;
    }

    public startQuestionnaire(questionnaire: Questionnaire) {
        if (this.active) {
            console.error("The questionnaire active questionnaire is uncompleted");
            return;
        }

        if (!questionnaire.id) {
            console.error("The questionnaire must have an ID");
            return;
        }

        this.controller = controllers.get(questionnaire.controller_type);

        if (!this.controller) {
            console.error("Unsupported questionnaire controller");
            return;
        }

        this.active = questionnaire;
        const msg = this.controller?.onStart(questionnaire);
        const chat = useChat();
        chat.push(msg);
    }

    public restoreState(questionnaire: Questionnaire) {
        this.controller = controllers.get(questionnaire.controller_type);
        if(this.controller)
            this.active = questionnaire;
        else
            console.error("Unsupported questionnaire controller type");
    }

    public nextQuestion(): boolean {
        if (!this.active)
            return false;

        const next = this.active.queue.shift();
        if (!next)
            return false;

        const chat = useChat();
        const msg = createQuestionnaireMessage(this.active.id, next);
        chat.push(msg);
        return true;
    }

    public submitAnswer(question_id: string, answer: any) {
        const active_id = this.active?.id;
        if (!active_id)
            return;

        const chat = useChat();
        const msg = chat.messages.find(x =>
            x.question?.questionnaire_id.startsWith(active_id) &&
            x.question.question_id == question_id);

        if (msg?.question) {
            this.controller?.onAnswer(this.active!, msg.question, answer);
        }
    }

    public endQuestionnaire() {
        if (!this.active) {
            console.error("No active questionnaire");
            return;
        }

        if(!this.active.completed)
        {
            this.active.completed = true;
            const chat = useChat();
            const msg = this.controller!.onComplete(this.active);
            chat.push(msg);
        }
    }
}

const context = reactive(new QuestionnaireContext())

export default function useQuestionnaire() {
    return context;
}
