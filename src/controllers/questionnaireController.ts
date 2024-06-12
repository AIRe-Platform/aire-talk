import { ChatMessage } from "@/models/chat";
import { Questionnaire } from "@/models/questionnaire";
import { AireQuestionnaireAnswer } from "aire";

export default interface QuestionnaireController
{
    onStart: (self: Questionnaire) => ChatMessage;
    onAnswer: (self: Questionnaire, question: AireQuestionnaireAnswer, answer: any) => void;
    onComplete: (self: Questionnaire) => ChatMessage;
}
