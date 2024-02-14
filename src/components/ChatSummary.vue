<script setup lang="ts">
import { ref } from 'vue';
import { l } from '@/locales';
import { UIState } from '@/context/ui';
import { Chat, getAbstract } from '@/context/chat';

const isSmallDevice = ref(window.innerWidth < 600 ? true : false);
const isSumaryyOpen = ref(isSmallDevice.value ? false : true);
//To read form the imput a text and save it in a string.
export interface Word {
    id: number,
    word: string,
    isSelected: boolean,
}


/**
 * Toogle the summary panel:
 * If device screen size  < 600px width it is hide by default. and you can activate with a button. 
 * If device screen >600px width then is always open and can not toggle.
 */
const toggleSummary = () => {
    UIState.isSummaryOpen = !UIState.isSummaryOpen;
    isSumaryyOpen.value = !isSumaryyOpen.value;
};

const loadTextFromSummary = () => {
    clearSummary();
    clearKeywords();

    getAbstract();

    //getSummary();
    //getKeywords(false);
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
</script>

<template>
    <div class="summary-wrapper" v-if="isSumaryyOpen">
        <div class="summary-chat-log-panel">
            <div class="summary-chat-log-title">
                {{ $t(l.summary_chag_log_title) }}
            </div>
            <div class="summary-chat-log-content">
                <div class="summary-chat-log-text">
                    {{ Chat.summary }}
                </div>
                <div class="summary-chat-log-key-words" >
                    <div class="summary-chat-log-word" v-for=" word, id  in Chat.keywords" :key="id">
                        <button class="summary-chat-log-word-button">
                            {{ word }}
                            <div class="summary-chat-log-word-button-action" @click="removeWord(word)">
                                <font-awesome-icon icon="fa-solid fa-xmark" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="summary-chat-log-button">
                <button @click="loadTextFromSummary">
                    {{ $t(l.summary_log_button) }}
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate" class="chat-bubble-options-icon" />
                </button>
            </div>
        </div>
        <div class="summary-cbr-icf-panel" style="display: none;">
            <div class="summary-cbr-icf-title">
                {{ $t(l.summary_classification_title) }}
            </div>
            <div class="summary-cbr-icf-content">
                <div class="summary-cbr-icf-logo">
                    <img class="summary-cbr-icf-logo-image" src="@/assets/images/topic.png" alt="Logo">
                </div>
                <div class="summary-cbr-icf-text">
                    <p> this is cbr/ocf clasificartion some text here lorem ipsum blab bla blasome text here lorem ipsum
                        blab bla blasome text here lorem ipsum blab bla blasome text here lorem ipsum blab bla blasome text
                        here lorem ipsum blab bla bla</p>
                </div>
                <div class="summary-cbr-icf-button">
                    <button>
                        CBR / ICF
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="summary-toggle-button">
        <button class="summary-toggle-button-icon" v-if="isSmallDevice" @click="toggleSummary()">
            <font-awesome-icon icon="fa-solid fa-sliders" />
        </button>
    </div>
</template>

<style scoped>
.summary-wrapper {
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

.summary-chat-log-panel {
    min-height: 50%;
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
    padding: 1rem;
}

.summary-chat-log-title {
    display: flex;
    justify-content: center;
    font-size: larger;
}

.summary-chat-log-content {
    display: flex;
    flex-direction: column;
    font-size: x-small;
}

.summary-chat-log-text {
    display: flex;
    flex-wrap: wrap;
}

.summary-chat-log-word {
    width: fit-content;
    display: flex;
    justify-content: center;
    margin-right: 0.3rem;
    height: 2rem;
}

.summary-chat-log-word-button{
    display: flex;
    flex-direction: row;
    cursor: unset;
    justify-content: space-between;
    width: fit-content;
    align-items: center;
}

.summary-chat-log-word-button-action{
    cursor: pointer;
}
.summary-chat-log-key-words {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-bottom: 3rem;
    margin-top: 2rem;
}

.summary-chat-log-array-words-wrapper {
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
}

.summary-chat-log-array-word {
    margin-right: 1rem;
}

.summary-chat-log-array-word-wrapper {
    color: var(--text-color);
    background-color: var(--background-color);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
    transition: all 0.1s;
    display: flex;
}

.summary-chat-log-button {
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.summary-cbr-icf-panel {
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
    padding: 1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
}

.summary-cbr-icf-title {
    display: flex;
    justify-content: center;
    font-size: larger;
}

.summary-cbr-icf-content {
    display: flex;
    flex-direction: column;
}

.summary-cbr-icf-logo {
    display: flex;
    justify-content: center;
    padding: 1rem;
}

.summary-cbr-icf-button {
    display: flex;
    justify-content: center;
    margin-top: 5rem;
}

.summary-toggle-button {
    position: absolute;
    bottom: 4.5rem;
    right: 0.5rem;
    border-radius: 50px;
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
    .summary-wrapper {
        top: 0px;
        right: 0;
        left: 2.5rem;
        width: 70%;
        overflow: scroll;
    }

    .summary-chat-log-title {
        font-size: medium;
    }

    .summary-cbr-icf-text {
        font-size: x-small;
    }

    .summary-cbr-icf-title {
        font-size: medium;
    }

    .summary-chat-log-word {
        font-size: xx-small;
        margin: 0.2rem;
        padding: 0rem;
        height: 1rem;
    }

    .summary-chat-log-button {
        margin-top: 0rem;
    }

    .summary-chat-log-array-words {
        font-size: xx-small;
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