// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { createQuestionnaire, queryFeedbackQuestionnaire } from "@/helpers/questionnaireUtils";
import useQuestionnaire from "./questionnaire";
import { reactive } from "vue";


export class FeedbackContext {
    public has_submitted_feedback = false;

    /** 
     * Start the questionnaire to save into events 
     */
    public async beginQuestionnaire() {

        const questionnaires = useQuestionnaire();

        const queried = await queryFeedbackQuestionnaire();

        if (queried) {
            const questionnaire = createQuestionnaire(queried);
            if (questionnaire)
                questionnaires.startQuestionnaire(questionnaire);
        }
    }

    public async complete() {
        this.has_submitted_feedback = true;
    }
}

const feedbackContext = reactive<FeedbackContext>(new FeedbackContext());
export default function useFeedback() {
    return feedbackContext;
}
