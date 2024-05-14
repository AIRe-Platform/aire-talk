<script setup lang="ts">
import { l } from '@/locales';
import {
    Chat,
    queryAndStartQuestionnaire,
    refreshAbstract,
    refreshContentCatalogue,
    startPersonalInformationQuestionnaire
} from '@/context/chat';
import { ref } from 'vue';
import Spinner from '@/components/Spinner.vue';
import Panel from '@/components/Panel.vue';
import { getMissingPersonalInformationQuestions } from "@/helpers/questionnaireUtils";
import { UISettings } from '@/context/ui';


const busy = ref(false);

const generateSummary = async () => {
    busy.value = true;
    clearSummary();
    clearKeywords();
    await refreshAbstract();
    await refreshContentCatalogue();
    busy.value = false;
}

const querySurveys = async () => {
    busy.value = true;
    await queryAndStartQuestionnaire();
    busy.value = false;
}

const askPersonalInformation = () => {
    startPersonalInformationQuestionnaire();
}

const removeWord = (word: string) => {
    if (Chat.current.keywords) {
        Chat.current.keywords.splice(Chat.current.keywords.indexOf(word), 1);
    }
}

const clearSummary = () => {
    Chat.current.summary = undefined;
}

const clearKeywords = () => {
    Chat.current.keywords = undefined;
}
</script>

<template>
    <Panel class="summary-panel"
        :class="{ 'summary-panel-fake-mobile-screen': UISettings.screenSize == 'mobile-screen' }">
        <div class="summary-title">
            {{ $t(l.summary_chag_log_title) }}
        </div>
        <Spinner v-if="busy" />
        <template v-if="!busy">
            <div class="summary-text" v-if="Chat.current.summary">
                {{ Chat.current.summary }}
            </div>
            <div class="summary-keywords" v-if="(Chat.current.keywords || []).length > 0">
                <div class="summary-keyword-item" v-for="word, id  in Chat.current.keywords" :key="id">
                    <span class="summary-keyword-text">{{ word }}</span>
                    <div class="summary-keyword-delete" @click="removeWord(word)">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                    </div>
                </div>
            </div>
            <div class="summary-buttons" v-if="!busy">
                <button class="summary-button" @click="generateSummary">
                    <span class="summary-button-text">{{ $t(l.summary_generate_summary) }}</span>
                    <div class="update-icon">
                    </div>
                </button>
                <button class="summary-button" @click="querySurveys"
                    v-if="(Chat.current.keywords || []).length > 0 && !Chat.current.questionnaire">
                    <span class="summary-button-text">{{ $t(l.summary_query_surveys_button) }}</span>
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                </button>
                <button v-if="getMissingPersonalInformationQuestions().length > 0" class="summary-button"
                    @click="askPersonalInformation">
                    <span class="summary-button-text">{{ $t(l.profile_question_button) }}</span>
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
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
    background-color: var(--panel-background-color);
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

.summary-panel-fake-mobile-screen {
    position: relative;
    top: 3rem;
    left: 4rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
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