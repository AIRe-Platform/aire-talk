import { l } from "@/locales";

export interface Topic {
    id: number;
    name: string;
    localization_key: string;
}

export type Topics = Array<Topic>;

export const initialTopics: Topics = [
    {
        id: 0,
        name: "Back pain",
        localization_key: l.topic_backpain
    },
    {
        id: 1,
        name: "Neck pain",
        localization_key: l.topic_neckpain
    },
    {
        id: 2,
        name: "Sleep apnea",
        localization_key: l.topic_sleep_apnea
        
    },
    {
        id: 3,
        name: "Increased weight",
        localization_key: l.topic_increased_weight
    },
    {
        id: 4,
        name: "Trouble walking",
        localization_key: l.topic_trouble_talking
    }
]
