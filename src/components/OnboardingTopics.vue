<script setup>
import { ref } from 'vue';
import { router } from "@/router";
import { createNewChat } from "@/context/chat";
import { l } from '@/locales';
import { Login } from '@/context/login';
import { initialTopics } from "@/models/topic";
import { vOnClickOutside } from '@vueuse/components';

//to Toggle menu
const isOpen = ref(false);

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};

const buttonSelected = async (topic) => {
    topic.isSelected = true;
    for (let oldTopic of initialTopics) {
        if (oldTopic.isSelected)
            oldTopic.isSelected = false;
    }
    if (Login.logged_in) {
        await createNewChat(topic)
        router.push("/chat");
    }
    else {
        router.push("/landing");
    }
};

</script>

<template>
    <div class="onboarding-topics" v-if="isOpen">
        <div class="onboarding-topics-panel" v-on-click-outside="toggleMenu">
            <div class="onboarding-topics-header"> {{ $t(l.onboarding_greetings) }} </div>
            <div class="onboarding-topics-question">{{ $t(l.onboarding_question) }} </div>
            <div class="onboarding-topics-choices">
                <div class="onboarding-topics-column-1">
                    <img src="@/assets/images/aire-logo-512.png" alt="Logo">
                </div>
                <div class="onboarding-topics-column-2">
                    <div class="onboarding-topics-buttons" v-for="topic in initialTopics" :key="topic.id">
                        <button class="onboarding-topics-button" @click="buttonSelected(topic)"
                            :class="{ 'not-selected': !topic.isSelected, 'is-selected': topic.isSelected }">
                            {{ topic.name }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button class="onboarding-button" @click.stop="toggleMenu">
        <img src="@/assets/images/aire-logo-512.png"
            class="onboarding-button-image" alt="Logo">
    </button>
</template>


<style scoped>
.onboarding-topics {
    right: 8rem;
    top: 4rem;
    position: absolute
}

.onboarding-topics-header {
    font-size: large;
    font-weight: bold;
}

.onboarding-button {
    position: absolute;
    right: 3rem;
    top: 5rem;
    cursor: pointer;

    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
}

.onboarding-topics-panel {
    display: block;
    padding: 1rem;
    margin: 1rem;
    max-width: 42rem;

    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
}

.onboarding-topics-choices {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 1rem;
    width: 23rem;
}

.onboarding-topics-buttons {
    display: flex;
    flex-direction: column;
}

.onboarding-topics-column-1 {
    width: 20%;
    height: 5rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.onboarding-topics-column-2 {
    width: 70%;
}

.onboarding-topics-button {
    margin: 0.5rem;
}

.onboarding-button-image {
    width: 2.4rem;
    margin: 0.2rem;
}
</style>