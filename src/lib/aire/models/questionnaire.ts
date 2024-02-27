export enum AireQuestionOptionType {
    Range = "range",
    Checkbox = "checkbox",
    Open = "open",
    Number = "number"
}

export interface AireQuestionOptionRange {
    min: number;
    max: number;
}

export interface AireQuestionOptionCheckbox {
    values: Array<string>;
    multiselect: boolean;
}

export interface AireQuestionOptionOpen {
    max_len?: number;
    match?: string;
    multiline: boolean;
}

export interface AireQuestionOptionNumber {
    min?: number;
    max?: number;
    default?: number
}

export type AireQuestionOption = 
    AireQuestionOptionRange | 
    AireQuestionOptionCheckbox | 
    AireQuestionOptionOpen | 
    AireQuestionOptionNumber;

export interface AireQuestion {
    id: string;
    question: string;
    keywords?: Array<string>;
    prompt: string;
    type: AireQuestionOptionType;
    options?: AireQuestionOption;
    required: boolean;
}

export interface AireQuestionnaireContent {
    id: string;
    name: string;
    keywords?: Array<string>;
    questions: Array<AireQuestion>;
}

export interface AireQuestionnaire {
    id: string;
    name: string;
    lang: string;
    modified: Date;
    keywords: Array<string>;
    content: Array<AireQuestionnaireContent>;
}

export interface AireQuestionnaireAnswer {
    questionnaire_id: string;
    question_id: string;
    type: AireQuestionOptionType;
    question: string;
    prompt?: string;
    answer?: any;
    options?: AireQuestionOption;
}

export interface AireQuestionnaireResults {
    id?: string;
    questionnaire_id: string;
    timestamp?: Date;
    answers: AireQuestionnaireAnswer[];
    summary: string;
    prompts?: string[];
}
