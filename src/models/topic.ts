
export interface Topic {
    id: number;
    name: string;
    description: string;
    data?: object;
    isSelected?: boolean;
    translations?: {
        language_id: number;
        language_name: string;
        translation_name: string;
        translation_description: string;
    }

}

export type Topics = Array<Topic>;

export const initialTopics: Topics = [
    {
        "id": 0,
        "name": "Back pain",
        "description": "this is something about the back",
        "data": [],
        "isSelected": false
    },
    {
        "id": 1,
        "name": "Neck pain",
        "description": "this is something about the neck",
        "data": [],
        "isSelected": false
    },
    {
        "id": 2,
        "name": "Sleep apnea",
        "description": "this is something about the sleep problems",
        "data": [],
        "isSelected": false
    },
    {
        "id": 3,
        "name": "Increased weight",
        "description": "this is something about your weight",
        "data": [],
        "isSelected": false
    },
    {
        "id": 4,
        "name": "Trouble walking",
        "description": "this is something about your next steps",
        "data": [],
        "isSelected": false
    },
    {
        "id": 5,
        "name": "Other...",
        "description": "You have no clue of your pains",
        "data": [],
        "isSelected": false
    }
];