<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { l } from '@/locales';
import { SummaryState } from '@/context/summaryState';
defineComponent({ name: "SummaryView" })

const isSmallDevice = ref(window.innerWidth < 600 ? true : false);
const isSumaryyOpen = ref(isSmallDevice.value ? false : true);
//To read form the imput a text and save it in a string.
let summaryText = ref<string[]>([]);
export interface Word {
    id: number,
    word: string,
    isSelected: boolean,
}

//Arrays of Word: to do the selection  of words.
let selectedTextArray = ref<Array<Word>>([]);
let selectedWordsArray = ref<Array<Word>>([]);

/**
 * Toogle the summary panel:
 * If device screen size  < 600px width it is hide by default. and you can activate with a button. 
 * If device screen >600px width then is always open and can not toggle.
 */
const toggleSummary = () => {

    SummaryState.isSummaryOpen = !(SummaryState.isSummaryOpen);
    isSumaryyOpen.value = !isSumaryyOpen.value;
};

/**
 * Load a file in the summary to read its content and save in an array of Words.
 */
const loadTextFromFile = (e: Event) => {
    if (!e.target) return

    const input = e.target as HTMLInputElement
    if (!input.files) return

    const file = input.files[0];
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = (res) => {
        if (res.target?.result == null)
            return;
        let text = res.target.result;

        if (typeof text === 'string')
            summaryText.value = text.split(" ");

        for (let i = 0; i < summaryText.value.length; i++) {
            let wordTemp = { id: i, word: summaryText.value[i], isSelected: false };
            selectedTextArray.value.push(wordTemp);
        }
    };
}

/**
 * Select the Word word. Puts it activate(some css)in selectedTextArray. and it saves in the array of selectedWordsArray.
 * @param word 
 */
const selectedWord = (word: Word) => {

    const found = selectedWordsArray.value.find((element) => element.id == word.id);
    if (!found) {
        selectedWordsArray.value.push(word);
        let wordTemp = { id: word.id, word: word.word, isSelected: true };
        selectedTextArray.value.splice(selectedTextArray.value.indexOf(word), 1, wordTemp);
    }
    else
        console.log("word ALREADY SELECTED");
};

/**
 * Remove the Word word form the selectedWordsArray. Also unactivate it in selectedTextArray.
 */
const removeWord = (word: Word) => {

    selectedWordsArray.value.splice(selectedWordsArray.value.indexOf(word), 1);
    const found = selectedTextArray.value.find((element) => element.id == word.id);

    if (!found)
        return;
    let wordTemp = { id: word.id, word: word.word, isSelected: false };
    selectedTextArray.value.splice(selectedTextArray.value.indexOf(found), 1, wordTemp);
};
</script>

<template>
    <div class="summary-wrapper" v-if="isSumaryyOpen">
        <div class="summary-chat-log-panel">
            <div class="summary-chat-log-title">
                {{ $t(l.summary_chag_log_title) }}
            </div>
            <div class="summary-chat-log-content">
                <label class="text-reader">
                    <input type="file" @change="loadTextFromFile">
                </label>
                <div class="summary-chat-log-text">
                    <div class="summary-chat-log-word" v-for=" word, id  in selectedTextArray" :key="id">
                        <div class="summary-chat-log-button" @click="selectedWord(word)"
                            :class="{ 'is-selected': word.isSelected }">
                            {{ word.word }}
                        </div>
                    </div>
                </div>
                <div class="summary-chat-log-array-words">
                    <div class="summary-chat-log-array-words-wrapper" v-for=" word, id  in selectedWordsArray" :key="id">
                        <div class="summary-chat-log-array-word-wrapper">
                            <div class="summary-chat-log-array-word">
                                {{ word.word }}
                            </div>
                            <div class="summary-chat-log-array-word-button" @click="removeWord(word)">
                                <font-awesome-icon icon="fa-solid fa-xmark" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="summary-chat-log-button">
                    <button @click="loadTextFromFile">
                        {{ $t(l.summary_log_button) }}
                    </button>
                </div>
            </div>
        </div>
        <div class="summary-cbr-icf-panel">
            <div class="summary-cbr-icf-title">
                {{ $t(l.summary_classification_title) }}
            </div>
            <div class="summary-cbr-icf-content">
                <div class="summary-cbr-icf-logo">
                    <img class="summary-cbr-icf-logo-image" src="@/assets/logos/Conversation-topic-logo.png" alt="Logo">
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
    right: 4rem;
    width: 15%;
    height: auto;
    margin: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.summary-chat-log-panel {
    background-color: var(--panel-background-color);
    border-radius: 10px;
    margin-bottom: 2rem;
    padding: 2rem;
    min-height: 50%;
}

.summary-chat-log-title {
    display: flex;
    justify-content: center;
    font-size: larger;
}

.summary-chat-log-content {
    display: flex;
    flex-direction: column;
}

.summary-chat-log-text {
    display: flex;
    flex-wrap: wrap;
}

.summary-chat-log-words {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
}

.summary-chat-log-word {
    width: fit-content;
    display: flex;
    justify-content: center;
    margin-right: 0.3rem;
    height: 2rem;
}

.summary-chat-log-array-words {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-bottom: 3rem;
}

.summary-chat-log-array-words-wrapper {
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
}

.summary-chat-log-array-word {
    margin-right: 1rem;
}

.summary-chat-log-array-word-button {
    cursor: pointer;
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
    border-radius: 10px;
    margin-bottom: 2rem;
    padding: 2rem;
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