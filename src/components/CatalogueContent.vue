<script setup lang="ts">
    import { ChatMessage } from '@/models/chat';
    import { scrollToMessage } from '@/helpers/scrollToMessage'
    import { defineProps, onMounted, ref } from 'vue';
    import BubbleModal from './BubbleModal.vue';

    const props = defineProps<{message: ChatMessage}>()

    const id = props.message.timestamp.toString();

    // Modal 
    const modalActivate = ref(false);
    const toggleModal = () => {
        modalActivate.value = ! modalActivate.value;
    };

    let classList: any[] = ["chat-bubble"]
    switch(props.message.role)
    {
        case "assistant": classList.push("chat-bubble-bot"); break;
        case "user": classList.push("chat-bubble-user"); break;
        case "system": 
            classList.push("chat-bubble-system"); 
            break;
    }
    if(props.message.isError)
        classList.push("chat-bubble-error");

    onMounted(() => scrollToMessage(props.message));
</script>

<template>
    <BubbleModal :modalActivate="modalActivate">
        <div class="modal-component">
            <div class="modal-content">
                <div class="modal-header">
                    <h1>{{ message.sender }}</h1>
                </div>
                <div class="modal-body">
                    <p> {{ message.message }}</p>
                    <div class="modal-body-image" v-if="message.image" >
                        <img v-bind:src="message.image" class="chat-message-image-contain">
                    </div>
                    <div class="modal-body-video" v-if="message.video" >
                        <video width="320" height="240" controls>
                            <source v-bind:resource="message.video" :key="message.video" type="video/mp4">
                        </video>
                    </div>
                </div>
                <div class="modal-footer">
                </div>
            </div>
            <div class="modal-button">
                <div @click="toggleModal" type="button">X</div>
            </div>
        </div>
        </BubbleModal>
    
    <div :id=id :class=classList @click="toggleModal" v-if="message.image || message.video">
        <div class="chat-bubble-content">
            <span class="chat-message-text">{{ message.message }}</span>
            <div class="chat-message-image" v-if="message.image" >
                <img v-bind:src="message.image" class="chat-message-image-contain">
            </div>
            <div class="chat-message-video" v-if="message.video" >
                
               <!--  <video width="320" height="240" controls>
                    <source v-bind:src="message.video" type="video/mp4">
                </video> -->
                <iframe width="460" height="320" src="https://www.youtube.com/embed/ca_cKWWzZgs?si=QRRLdzonA1005i1J" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-component {
    display: flex;
    justify-content: space-between;
}
.modal-content{
}
.modal-header{
    
}
.modal-body-image{
    display: flex;
    justify-content: center;    
}
.modal-footer{
    
}
.modal-button{
    cursor: pointer;
    width: 2rem;
    display: flex;
    justify-content: center;
}

.chat-bubble {
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

.chat-bubble-user {
    align-self: flex-end;
    margin-left: 3rem;
}

.chat-bubble-bot {
    align-self: flex-start;
    margin-right: 3rem;
}

.chat-bubble-system {
    align-self: center;
    margin: 0 3rem;
    border-color: var(--accent-secondary-color);
}

.chat-bubble-error {
    border-color: var(--error-color);
}

.chat-bubble-content {
    display: flex;
    flex-direction: column;
}

.chat-user-label {
    font-size: x-small;
}

.chat-message-text {
    white-space: pre-line;
}
.chat-message-image{ 
    display: flex;
    flex-direction: column;

    justify-content: center;
}
.chat-message-video{ 
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.chat-message-image-contain {
    height: 80%;
    width: 80%;
    object-fit: contain;
}
</style>