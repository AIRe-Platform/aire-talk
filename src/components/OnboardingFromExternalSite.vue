<script setup>
import { ref } from 'vue';
import { router } from "@/router";
import { Chat } from "@/context/chat";
import { l } from '@/locales';
import { Login } from '@/context/login';
import { initialTopics } from "@/models/topic";


const isOpen = ref(false);


const toggleMenu = () => {
    isOpen.value = !isOpen.value;
   };

const buttonSelected = (topic) => { 
    topic.isSelected = true;
    Chat.OnboardingFromExternalSite = topic;
    for(let oldTopic of initialTopics){
        if(oldTopic.isSelected)
            oldTopic.isSelected = false;
    }
    if(Login.logged_in)
        router.push("/checkBox");
    else
        router.push("/landing");
        
};

</script>

<template>
    <div class="onboarding-from-external-site-object">
        <div class="onboarding-from-external-site-wrapper" v-if="isOpen">
            <div class="onboarding-from-external-site-header"> {{ $t(l.onboarding_greetings) }} </div>
            <div class="onboarding-from-external-site-question">{{ $t(l.onboarding_question) }} </div>
            <div class="onboarding-from-external-site-answers-panel">
                <div class="onboarding-from-external-site-answers-left">
                    <img src="@/assets/logos/AIRE-Platform-Logo-400x400.png" alt="Logo">
                </div>
                <div class="onboarding-from-external-site-answers-right">
                    <div class="onboarding-from-external-site-anwsers" v-for="topic in initialTopics" :key="topic.id" >
                        <button 
                            class="onboarding-from-external-site-anwsers-button"
                            @click="buttonSelected(topic)" :class="{ 'not-selected': !topic.isSelected,'is-selected': topic.isSelected }"
                        >
                            {{ topic.name }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="onboarding-from-external-site-start-button">
        <button @click="toggleMenu">
            <img src="@/assets/logos/AIRE-Platform-Logo-400x400.png" class="onboarding-from-external-site-start-button-image" alt="Logo">
        </button>
    </div> 
</template>


<style scoped>

.onboarding-from-external-site-object{
    right: 7rem;
    top: 4rem;
    position: absolute

}
.onboarding-from-external-site-header{
    font-size: large;
    font-weight: bold;
}
.onboarding-from-external-site-start-button{
    right: 3rem;
    top: 5rem;
    position: absolute;
    width: 2rem;
    height: 2rem;
}
.onboarding-from-external-site-wrapper{
    display: block;
    padding: 0.5rem 1rem;
    margin: 1rem;
    line-height: 1.4rem;
    max-width: 42rem;
    background-color: var(--chat-bubble-background-color);
    box-shadow: 0 0 5px gray;
    border-radius: 1rem;
    border: 1px solid transparent;
}
.onboarding-from-external-site-answers-panel{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 1rem;
    width: 23rem;
}
.onboarding-from-external-site-anwsers {
    display: flex;
    flex-direction: column;
}
.onboarding-from-external-site-answers-left{
    width:20%;
    height: 5rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.onboarding-from-external-site-answers-right{
    width: 70%;
}
.onboarding-from-external-site-anwsers-button{
    margin: 0.5rem;
}
.onboarding-from-external-site-start-button-image{
    width: 2rem;
}
</style>