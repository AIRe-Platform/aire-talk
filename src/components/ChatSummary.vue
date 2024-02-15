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
    if(Chat.keywords){     
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
            <div class="summary-content">
                <div class="summary-text">
                    {{ Chat.summary }}
                </div>
                <div class="summary-key-words-panel" >
                    <div class="summary-key-word" v-for=" word, id  in Chat.keywords" :key="id">
                        <button class="summary-key-word-button">
                            {{ word }}
                            <div class="summary-key-word-button-action" @click="removeWord(word)">
                                <font-awesome-icon icon="fa-solid fa-xmark" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="summary-chat-button">
                <button @click="loadSummary">
                    {{ $t(l.summary_log_button) }}
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate"/>
                </button>
            </div>
            <div class="summary-chat-button">
                <button @click="getQuerySurveys">
                    {{ $t(l.summary_query_surveys_button) }}
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate"/>
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
    font-size: larger;
}

.summary-content {
    display: flex;
    flex-direction: column;
    font-size: x-small;
}

.summary-text {
    display: flex;
    flex-wrap: wrap;
}

.summary-key-word {
    width: fit-content;
    display: flex;
    justify-content: center;
    margin-right: 0.3rem;
    height: 2rem;
}

.summary-key-word-button{
    display: flex;
    flex-direction: row;
    cursor: unset;
    justify-content: space-between;
    width: fit-content;
    align-items: center;
}

.summary-key-word-button-action{
    cursor: pointer;
}
.summary-key-words-panel {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-bottom: 3rem;
    margin-top: 2rem;
}
.summary-chat-button {
    display: flex;
    justify-content: center;
    cursor: pointer;
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

    .summary-key-word {
        font-size: xx-small;
        margin: 0.2rem;
        padding: 0rem;
        height: 1rem;
    }

    .summary-chat-button {
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