<script setup lang="ts">
import { l } from '@/locales';
import {
    Chat,
    queryAndStartQuestionnaire,
    refreshAbstract,
    sendQuestionnaireAnswers
} from '@/context/chat';
import { ref } from 'vue';
import Spinner from './Spinner.vue';
import Panel from './Panel.vue';

const busy = ref(false);

const generateSummary = async () => {
    busy.value = true;
    clearSummary();
    clearKeywords();
    await refreshAbstract();
    busy.value = false;
}

const querySurveys = async () => {
    busy.value = true;
    await queryAndStartQuestionnaire();
    busy.value = false;
}

const removeWord = (word: string) => {
    if (Chat.keywords) {
        Chat.keywords.splice(Chat.keywords.indexOf(word), 1);
    }
}

const sendSurvey = async () => {
    busy.value = true;
    await sendQuestionnaireAnswers();
    busy.value = false;
}

const clearSummary = () => {
    Chat.summary = undefined;
}

const clearKeywords = () => {
    Chat.keywords = undefined;
}
</script>

<template>
    <Panel class="summary-panel">
        <div class="summary-title">
            {{ $t(l.summary_chag_log_title) }}
        </div>
        <Spinner v-if="busy" />
        <template v-if="!busy">
            <div class="summary-text" v-if="Chat.summary">
                {{ Chat.summary }}
            </div>
            <div class="summary-keywords" v-if="(Chat.keywords || []).length > 0">
                <div class="summary-keyword-item" v-for="word, id  in Chat.keywords" :key="id">
                    <span class="summary-keyword-text">{{ word }}</span>
                    <div class="summary-keyword-delete" @click="removeWord(word)">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                    </div>
                </div>
            </div>
            <div class="summary-buttons" v-if="!busy">
                <button class="summary-button" @click="generateSummary">
                    <span class="summary-button-text">{{ $t(l.summary_generate_summary) }}</span>
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
                </button>
                <button class="summary-button" @click="querySurveys"
                    v-if="(Chat.keywords || []).length > 0 && !Chat.questionnaire">
                    <span class="summary-button-text">{{ $t(l.summary_query_surveys_button) }}</span>
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
                </button>
                <button class="summary-button" @click="sendSurvey" v-if="Chat.questionnaire?.completed">
                    <span class="summary-button-text">{{ $t(l.summary_send_survey_button) }}</span>
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
                </button>
            </div>
        </template>
    </Panel>
</template>

<style scoped>
.summary-panel {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    align-items: center;

    width: 12rem;
    padding: 1rem;
    margin: 1rem;
    gap: 1rem;
}

.summary-title {
    display: flex;
    justify-content: center;
}

.summary-text {
    display: flex;
    font-size: small;
    flex-wrap: wrap;
    line-height: 1.5rem;
    text-align: justify;
}

.summary-keyword-item {
    display: flex;
    flex-direction: row;
    font-size: small;
    justify-content: center;
    align-items: stretch;
    height: 2rem;
    border-radius: 1rem;
    border: 2px solid var(--border-color);
    background-color: var(--background-color);
}

.summary-keyword-text {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-secondary-color);
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
    border-top: 2px dotted var(--border-color);
    border-bottom: 2px dotted var(--border-color);
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
    justify-content: center;
    cursor: pointer;
}

.summary-button-text {
    margin-right: 0.5rem;
}

@media screen and (max-width: 600px) {
    .summary-panel {
        width: unset;
    }

    .summary-title {
        font-size: medium;
    }

    .summary-keyword {
        font-size: xx-small;
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