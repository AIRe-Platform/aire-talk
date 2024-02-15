<script setup lang="ts">
import { l } from '@/locales';
import { UIState } from '@/context/ui';
import { Chat, refreshAbstract } from '@/context/chat';
import { onMounted } from 'vue';

/**
 * Toogle the summary panel:
 * If device screen size  < 600px width it is hide by default. and you can activate with a button. 
 * If device screen >600px width then is always open and can not toggle.
 */
const toggleSummary = () => {
    UIState.isSummaryOpen = !UIState.isSummaryOpen;
};

const loadSummary = () => {
    clearSummary();
    clearKeywords();
    refreshAbstract();

    //getSummary();
    //getKeywords(false);
}

const getQuerySurveys = () => {
    console.log("getQuerySurveys");
}

const removeWord = (word: string) => {
    if (Chat.keywords) {
        Chat.keywords.splice(Chat.keywords.indexOf(word), 1);
    }
}

const clearSummary = () => {
    Chat.summary = undefined;
}
const clearKeywords = () => {
    Chat.keywords = undefined;
}

onMounted(() => {
    UIState.isSummaryOpen = !(window.innerWidth < 600)
})
</script>

<template>
    <div class="summary-panel-wraper" v-if="UIState.isSummaryOpen">
        <div class="summary-panel">
            <div class="summary-title">
                {{ $t(l.summary_chag_log_title) }}
            </div>
            <div class="summary-text">
                {{ Chat.summary }}
            </div>
            <div class="summary-keywords">
                <div class="summary-keyword-item" v-for="word, id  in Chat.keywords" :key="id">
                    <span class="summary-keyword-text">{{ word }}</span>
                    <div class="summary-keyword-delete" @click="removeWord(word)">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                    </div>
                </div>
            </div>
            <div class="summary-buttons">
                <button class="summary-button" @click="loadSummary">
                    <span class="summary-button-text">{{ $t(l.summary_generate_summary) }}</span>
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
                </button>
                <button class="summary-button" @click="getQuerySurveys">
                    <span class="summary-button-text">{{ $t(l.summary_query_surveys_button) }}</span>
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
                </button>
            </div>
        </div>
    </div>
    <div class="summary-toggle-button">
        <button class="summary-toggle-button-icon" @click="toggleSummary()">
            <font-awesome-icon icon="fa-solid fa-sliders" />
        </button>
    </div>
</template>

<style scoped>
.summary-panel-wraper {
    position: absolute;
    top: 0;
    right: 0rem;
    width: 14rem;
    height: 80%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.summary-panel {
    min-height: 50%;
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
    padding: 1rem;
}

.summary-title {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
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
    margin: 1rem 0 1rem 0;
    padding: 1rem 0 1rem 0;
    border-top: 2px dotted var(--border-color);
    border-bottom: 2px dotted var(--border-color);
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

.summary-toggle-button {
    display: none;
}

.summary-toggle-button-icon {
    width: 1.3rem;
    height: 1.3em;
    display: flex;
    align-items: center;
    padding: 0;
    justify-content: center;
}

/* mobile*/
@media screen and (max-width: 600px) {
    .summary-toggle-button {
        display: block;
        position: absolute;
        bottom: 7%;
        right: 5%;
        border-radius: 50px;
    }

    .summary-panel-wraper {
        top: 0px;
        right: 0;
        left: 2.5rem;
        width: 70%;
        overflow: scroll;
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