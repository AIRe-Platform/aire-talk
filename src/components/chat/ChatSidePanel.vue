<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { onMounted, reactive, defineEmits, defineProps, computed } from 'vue';
import { adjustTooltipPosition } from '@/helpers/tooltipUtils';
import { createQuestionnaire, queryQuestionnaire } from '@/helpers/questionnaireUtils';
import { createPersonalInfoQuestionnaire, createPersonalInformationQuestions } from '@/controllers/personalInfoController';
import useChat from '@/context/chat';
import useQuestionnaire from '@/context/questionnaire';
import Spinner from '@/components/common/Spinner.vue';
import Panel from '@/components/common/Panel.vue';
import { listChatKeywords, suggestContentWithKeywords, summarizeChat } from '@/helpers/chatUtils';
import { l } from '@/locales';
import useMobileLayout from '@/helpers/mobile';

const state = reactive<{
    busy: boolean,
    missingPersonalInfo: boolean,
    isMobile: boolean,
}>({
    busy: false,
    missingPersonalInfo: false,
    isMobile: false
});

const props = defineProps<{ isOpen: boolean }> ();
const chat = useChat();

const emits = defineEmits<{
    close: []
}>();

const questionnaires = useQuestionnaire();

const generateSummary = async () => {
    try {
        state.busy = true;
        await summarizeChat();
    } catch (error) {
        console.error('Error generating summary in ChatSummary:', error);
    } finally {
        state.busy = false;
    }
}

const querySurveys = async () => {
    try {
        state.busy = true;
        const keywords = listChatKeywords(chat.messages);
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

const makeSuggestions = () => {
    const keywords = listChatKeywords(chat.messages);
    suggestContentWithKeywords(keywords);
}

onMounted(() => {
    state.missingPersonalInfo = createPersonalInformationQuestions().length > 0;
    state.isMobile = useMobileLayout.value;
});

const sidePanelTabindex = computed(() => props.isOpen ? 0 : -1);
</script>

<template>
    <Panel class="chat-tools">
        <div class="chat-tools-header" :class="{ 'is-mobile': state.isMobile }">
            <div class="chat-tools-title">
                {{ $t(l.tools_title) }}
            </div>
            <div class="icon close-window xmark-icon tooltip"
                v-if="state.isMobile"
                @click.stop="emits('close')"
                role="button"
                :tabindex="sidePanelTabindex">
                <span class="tooltiptext">{{ $t(l.tooltip_close) }}</span>
            </div>
        </div>
        <Spinner v-if="state.busy" />
        <div class="chat-tool-buttons" v-else>
            <button class="chat-tool-button tooltip" @click="generateSummary" :tabindex="sidePanelTabindex">
                <span class="chat-tool-button-text">{{ $t(l.tools_button_summarize) }}</span>
                <div class="update-icon"></div>
                <span class="tooltiptext">{{ $t(l.tooltip_summarize) }}</span>
            </button>
            <button class="chat-tool-button tooltip" @click="querySurveys" :tabindex="sidePanelTabindex"
                v-if="listChatKeywords(chat.messages).length > 0 && !questionnaires.active">
                <span class="chat-tool-button-text">{{ $t(l.tools_button_query_surveys) }}</span>
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                <span class="tooltiptext">{{ $t(l.tooltip_query_surveys) }}</span>
            </button>
            <button v-if="state.missingPersonalInfo" class="chat-tool-button tooltip" @click="askPersonalInformation" :tabindex="sidePanelTabindex">
                <span class="chat-tool-button-text">{{ $t(l.profile_question_button) }}</span>
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                <span class="tooltiptext">{{ $t(l.tooltip_personal_information) }}</span>
            </button>
            <button class="chat-tool-button tooltip" @click="makeSuggestions" :tabindex="sidePanelTabindex"
                @mouseenter="adjustTooltipPosition($event, false)">
                <span class="chat-tool-button-text"> {{ $t(l.tools_button_suggestions) }} </span>
                <font-awesome-icon icon="fa-solid fa-lightbulb" />
                <span class="tooltiptext">{{ $t(l.tooltip_suggestions) }}</span>
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

.chat-tools-header {
    display: flex;

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

.is-mobile {
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
    gap: 6rem;
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