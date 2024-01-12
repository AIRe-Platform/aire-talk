<script setup lang="ts">
import { defineComponent, ref } from 'vue';
defineComponent({ name: "CheckBoxView" })
import { l } from '@/locales';
import { router } from "@/router";
import { RouterLink } from 'vue-router';
import { Chat } from "@/context/chat";
import data from '../../public/topicsCheckBox.json';
import { Topics } from "@/models/topic";

const topics = ref(data);

const isSelectedCheckBox = ref(false);
const selectedTopic = ref<Topics>();

const buttonSelected = (topic: typeof topics) => {  
    //console.log(" topics ", topics.value);
    for(let oldTopic of topics.value){
        if(oldTopic.isSelected)
            oldTopic.isSelected = false;
    }
    console.log(" boton selecionado ", topic);
    selectedTopic.value = topic;
    console.log("selectedTopic ", selectedTopic);
    isSelectedCheckBox.value = true;
};

const saveCheckbox = (e: Event) => {
    e.preventDefault();
    Chat.checkbox = selectedTopic.value;
    
    router.push("/chat");
};

</script>

<template>
    <div class="checkbox-wrapper">
        <div class="checkbox-content">
            <div class="checkbox-line"> {{ $t(l.checkbox_text) }} </div>
            <div class="checkbox-line"> {{ $t(l.checkbox_question) }} </div>

            <div class="checkbox-questions">
                <div class="checkbox-button-questions" v-for="topic in topics" :key="topic.id" >
                    <button @click="buttonSelected(topic)" :class="{ 'not-selected': !topic.isSelected,'is-selected': topic.isSelected }" v-on:click ="topic.isSelected = !topic.isSelected" >
                        {{ topic.name }}
                    </button>
                </div>
            </div>
            <div class="checkbox-description">
                    {{ selectedTopic?.description }}
                </div>
            <div class="checkbox-button">
                <button class="btn">
                    <RouterLink class="nav-link" to="/">{{ $t(l.checkbox_button_cancel) }}</RouterLink>
                </button>  
                
                <button class="btn" :disabled="!isSelectedCheckBox" @click="saveCheckbox">
                    {{ $t(l.checkbox_continue_button) }}
                </button>    
            </div>
        </div>
    </div>
</template>

<style scoped>
.checkbox-wrapper {
   margin: auto;
   width: 50%;
   border-radius: 10px;
   box-shadow: 0 0 5px var(--shadow-color);
}
.checkbox-content {
   margin: 3rem;
}
.checkbox-line {
   margin: 3rem;
}.checkbox-questions {
    margin: 3rem;
    display: flex;
    flex-wrap: wrap;
}
.checkbox-button-questions {
   margin: 3rem;
}
.checkbox-description{

}
.checkbox-button {
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   margin: 2rem;
}

button:disabled,
button[disabled]{
 border: 1px solid #999999;
 background-color: #cccccc;
 color: #666666;
 cursor:not-allowed;
}
button:hover{
 background-color: #cccccc !important;
}

</style>