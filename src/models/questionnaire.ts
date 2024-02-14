export interface QuestionItem {
    id: string;
    question: string;
    keywords: Array<string>;
    prompt: string;
    type: QuestionOptionType;
    options: QuestionOption;
    required: boolean;
}

export enum QuestionOptionType {
    Range = "range",
    Checkbox = "checkbox",
    Open = "open",
    Number = "number"
}

export interface QuestionOption {
    values?: Array<string>;
    max_len?: number;
    min?: number;
    max?: number;
    default?: number;
    match?: string;
    multiselect?: boolean;
    multiline?: boolean;
}

// export interface QuestionOptionRange extends QuestionOption {
//     min: number;
//     max: number;
// }

// export interface QuestionOptionCheckbox extends QuestionOption {
//     values?: Array<string>;
//     multiselect: boolean;
// }

// export interface QuestionOptionOpen extends QuestionOption {
//     max_len?: number;
//     match?: string;
//     multiline: boolean
// }

// export interface QuestionOptionOpen extends QuestionOption {
//     min?: number;
//     max?: number;
//     default?: number
// }

export interface Preliminary {
    properties: {
        [property_name: string]: { type: string };
    }
    required: Array<string>;
}

export interface Questionnaire {
    id: string;
    name: string;
    lang: string;
    modified: Date;
    keywords: Array<string>;
    preliminary?: Preliminary;
    content: Array<QuestionnaireContent>;
}

export interface QuestionnaireContent {
    id: string;
    name: string;
    keywords: Array<string>;
    questions: Array<QuestionItem>;
}