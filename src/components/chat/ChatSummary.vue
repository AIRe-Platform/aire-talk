<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import { onMounted, reactive } from 'vue';
import { createQuestionnaire, queryQuestionnaire } from '@/helpers/questionnaireUtils';
import { createPersonalInfoQuestionnaire, createPersonalInformationQuestions } from '@/controllers/personalInfoController';
import useChat, { ChatContext, onReceiveKeywords } from '@/context/chat';
import useSummary from '@/context/summary';
import useQuestionnaire from '@/context/questionnaire';

import Spinner from '@/components/common/Spinner.vue';
import Panel from '@/components/common/Panel.vue';

const state = reactive<{
    busy: boolean,
    missing_personal_info: boolean
}>({
    busy: false,
    missing_personal_info: false
});
const summary = useSummary();
const questionnaires = useQuestionnaire();
const chatContent: ChatContext = useChat();

const generateSummary = async () => {
    try {
        state.busy = true;

        summary.reset();
        await summary.update();
    } catch (error) {
        console.error('Error generating summary in ChatSummary:', error);
    } finally {
        state.busy = false;
    }
}


const generateSuggestions = async () => {
    try {
        state.busy = true;
        // Convert Set<string> to string[] and pass it to onReceiveKeywords
        const keywordsArray = Array.from(summary.keywords);
        await onReceiveKeywords(chatContent, keywordsArray, true);
        chatContent.suggestionMessage = null;

    } catch (error) {
        console.error('Error generating suggestions in ChatSummary:', error);
    } finally {
        state.busy = false;
    }
}

const querySurveys = async () => {
    try {
        state.busy = true;

        const queried = await queryQuestionnaire([...summary.keywords]);
        if (queried) {
            const questionnaire = createQuestionnaire(queried);
            if (questionnaire)
                questionnaires.startQuestionnaire(questionnaire);
        }
    } catch (error) {
        console.error('Error querySurveys in ChatSummary:', error);
    } finally {
        state.busy = false;
    }
}

const askPersonalInformation = () => {
    const personalInfoQuestionnaire = createPersonalInfoQuestionnaire();
    if (personalInfoQuestionnaire)
        questionnaires.startQuestionnaire(personalInfoQuestionnaire);
}

const removeWord = (word: string) => {
    summary.keywords.delete(word);
}

onMounted(() => {
    state.missing_personal_info = createPersonalInformationQuestions().length > 0;
})
</script>

<template>
    <Panel class="summary-panel">
        <div class="summary-title">
            {{ $t(l.summary_chag_log_title) }}
        </div>
        <Spinner v-if="state.busy" />
        <template v-if="!state.busy">
            <div class="summary-text" v-if="summary.summary">
                {{ summary.summary }}
            </div>
            <div class="summary-keywords" v-if="summary.keywords.size > 0">
                <div class="summary-keyword-item" v-for="word, id in summary.keywords" :key="id">
                    <span class="summary-keyword-text">{{ word }}</span>
                    <div class="summary-keyword-delete" @click="removeWord(word)">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                    </div>
                </div>
            </div>
            <div class="summary-buttons" v-if="!state.busy">
                <button class="summary-button" @click="generateSummary">
                    <span class="summary-button-text">{{ $t(l.summary_generate_summary) }}</span>
                    <div class="update-icon">
                    </div>
                </button>
                <button class="summary-button" @click="querySurveys"
                    v-if="summary.keywords.size > 0 && !questionnaires.active">
                    <span class="summary-button-text">{{ $t(l.summary_query_surveys_button) }}</span>
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                </button>
                <button v-if="state.missing_personal_info" class="summary-button" @click="askPersonalInformation">
                    <span class="summary-button-text">{{ $t(l.profile_question_button) }}</span>
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                </button>
                <button class="summary-button" v-if="chatContent.suggestionMessage" @click="generateSuggestions">
                    <span class="summary-button-text"> {{ $t(l.summary_suggestions) }} </span>
                    <font-awesome-icon icon="fa-solid fa-lightbulb" />
                </button>
            </div>
        </template>
    </Panel>
</template>

<style lang="scss" scoped>
.summary-panel {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    align-items: center;
    background-color: var(--panel-background-color);
    width: 12rem;
    padding: 1rem;
    margin: 1rem;
    gap: 1rem;
}

.update-icon {
    background-image: url("@/assets/icons/update-default.png");
    width: 0.7rem;
    height: 0.7rem;
    background-size: cover;
}

.summary-title {
    display: flex;
    justify-content: center;
}

.summary-text {
    display: flex;
    font-size: var(--font-small);
    flex-wrap: wrap;
    line-height: 1.5rem;
    text-align: justify;
}

.summary-keyword-item {
    display: flex;
    flex-direction: row;
    font-size: var(--font-small);
    justify-content: center;
    align-items: stretch;
    height: 2rem;
    border-radius: 1rem;
    border: 2px solid var(--border-color);
    background-color: var(--summary-keyword-item-background);
}

.summary-keyword-text {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--summary-keyword-item-font-color);
    margin-right: 1rem;
    margin-left: 1rem;
}

.summary-keyword-delete {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 2rem;
    transition: color .2s;
    color: #B6465F;
    font-size: large;

    &:hover {
        color: var(--accent-secondary-color);
    }
}

.summary-keywords {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem 0 1rem 0;
    border-top: 2px dotted var(--dividers);
    border-bottom: 2px dotted var(--dividers);
    width: 100%;
}

.summary-buttons {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 0.5rem;
}

.summary-button {
    display: flex;
    justify-content: space-around;
    cursor: pointer;
    align-items: center;
    width: 160px;
    height: 33px;
}

.summary-button-text {
    margin-right: 0.5rem;
}

.ui-mode-mobile {
    .summary-panel {
        width: unset;
    }

    .summary-keyword {
        margin: 0.2rem;
        padding: 0rem;
        height: 1rem;
    }

    .summary-button {
        margin-top: 0rem;
    }

    input[type=submit],
    button {
        &:hover {
            color: white;
            border-color: white;
        }
    }
}
</style>