import { AireQuestion, AireQuestionnaireAnswer } from "aire";

export enum QuestionnaireControlFlow 
{
    Default = "default",
    PersonalInfo = "personal_info",
    Reminder = "reminder"
}

export interface Questionnaire {
    id: string;
    name: string;
    queue: Array<AireQuestion>;
    answers: Array<AireQuestionnaireAnswer>;
    controller_type: QuestionnaireControlFlow;
    completed: boolean;
}
