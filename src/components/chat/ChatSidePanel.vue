<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { createQuestionnaire, queryQuestionnaire } from '@/helpers/questionnaireUtils';
import { createPersonalInfoQuestionnaire, createPersonalInformationQuestions } from '@/controllers/personalInfoController';
import useChat, { ChatContext } from '@/context/chat';
import useQuestionnaire from '@/context/questionnaire';

import Spinner from '@/components/common/Spinner.vue';
import Panel from '@/components/common/Panel.vue';
import { listChatKeywords } from '@/helpers/chatUtils';
import { l } from '@/locales';

const state = reactive<{
    busy: boolean,
    missingPersonalInfo: boolean
}>({
    busy: false,
    missingPersonalInfo: false
});

const questionnaires = useQuestionnaire();
const chatContext: ChatContext = useChat();

const generateSummary = async () => {
    try {
        state.busy = true;
        await chatContext.summarize()
    } catch (error) {
        console.error('Error generating summary in ChatSummary:', error);
    } finally {
        state.busy = false;
    }
}

const querySurveys = async () => {
    try {
        state.busy = true;
        const keywords = listChatKeywords(chatContext.messages);
        const queried = await queryQuestionnaire(keywords);
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

const suggestContent = () => {
    alert("Not implemented");
}

onMounted(() => {
    state.missingPersonalInfo = createPersonalInformationQuestions().length > 0;
})
</script>

<template>
    <Panel class="chat-tools">
        <div class="chat-tools-title">
            {{ $t(l.tools_title) }}
        </div>
        <Spinner v-if="state.busy" />
        <div class="chat-tool-buttons" v-else>
            <button class="chat-tool-button" @click="generateSummary">
                <span class="chat-tool-button-text">{{ $t(l.tools_button_summarize) }}</span>
                <div class="update-icon"></div>
            </button>
            <button class="chat-tool-button" @click="querySurveys"
                v-if="listChatKeywords(chatContext.messages).length > 0 && !questionnaires.active">
                <span class="chat-tool-button-text">{{ $t(l.tools_button_query_surveys) }}</span>
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </button>
            <button v-if="state.missingPersonalInfo" class="chat-tool-button" @click="askPersonalInformation">
                <span class="chat-tool-button-text">{{ $t(l.profile_question_button) }}</span>
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </button>
            <button class="chat-tool-button" @click="suggestContent">
                <span class="chat-tool-button-text"> {{ $t(l.tools_button_suggestions) }} </span>
                <font-awesome-icon icon="fa-solid fa-lightbulb" />
            </button>
        </div>
    </Panel>
</template>

<style lang="scss" scoped>
.chat-tools {
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

.chat-tools-title {
    display: flex;
    justify-content: center;
}

.chat-tool-buttons {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 0.5rem;
}

.chat-tool-button {
    display: flex;
    justify-content: space-around;
    cursor: pointer;
    align-items: center;
    width: 160px;
    height: 33px;
}

.chat-tool-button-text {
    margin-right: 0.5rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-tools {
        width: unset;
    }

    .tool-button {
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