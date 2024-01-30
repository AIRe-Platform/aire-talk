export interface Question {
    id?: number;
    question: string;
    keywords: Array<string>;
    prompt: string;
    options: Option;
    required: boolean;
}

export type OptionType = "single-select" | "range" | "open" | "multi-select" | "number";

export interface Option {
    type: OptionType;
    values?: Array<string>;
    max_len?: number;
    min?: number;
    max?: number;
    default?: number;
    match?: string;
}

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
    content: Array<Question>;
}

