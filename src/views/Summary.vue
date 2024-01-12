<script setup lang="ts">
    import { defineComponent, ref } from 'vue';
    import { l } from '@/locales';
    import { SummaryState } from '@/context/summaryState';
    defineComponent({ name: "SummaryView" })

    const isSmallDevice = ref( window.innerWidth<600 ? true : false );

    const isSumaryyOpen = ref( isSmallDevice.value ? false : true );

    const toggleSummary = () => {

        SummaryState.isSummaryOpen = !(SummaryState.isSummaryOpen);
       
        isSumaryyOpen.value = !isSumaryyOpen.value;
    };

    let summaryText = ref([]);

    let arrayWords = ref([]);


/*     const wordsArray = ref<Array<string>>([]);
 */


     /**
     * Toggle the burger menu and send it to main view.
     */
    const loadTextFromFile = (ev) => {
    
        const file = ev.target.files[0];

        let reader = new FileReader();
      
        reader.readAsText(file);

        reader.onload = (res) => {
          let text = res.target.result;
          console.log("text??", text);

          summaryText.value = text.split(" ");
          console.log("myArray??", summaryText);
          
        };
    }

    const selectedWord = (word) => {
        console.log("selected ? ", word);
        arrayWords.value.push(word);
    }
    const removeWord = (word) => {
        console.log("removed ? ", word);
        console.log("index??", arrayWords.value.indexOf(word));

        arrayWords.value.splice(arrayWords.value.indexOf(word), 1);

    } 
</script>


<template>

    <div class="summary-wrapper" v-if="isSumaryyOpen">
        <div class="summary-chat-log-panel">
            <div class="summary-chat-log-title"> {{ $t(l.summary_chag_log_title) }} </div>
                <div class="summary-chat-log-content">
                    <label class="text-reader">
                        <input type="file" @change="loadTextFromFile">
                    </label>
                    <div class="summary-chat-log-text">
                        <div class="summary-chat-log-word" v-for=" word,id  in summaryText" :key="id">
                            <div class="summary-chat-log-button"  @click="selectedWord(word)">
                                {{ word }}
                            </div> 
                        </div>            
                    </div>
                    <div class="summary-chat-log-array-words">
                        <div class="" v-for=" word,id  in arrayWords" :key="id">
                            <div class="summary-chat-log-array-word-wrapper">
                                <div class="summary-chat-log-array-word">
                                    {{ word }}
                                </div>
                                <div class="summary-chat-log-array-word-button" @click="removeWord(word)">
                                    <font-awesome-icon icon="fa-solid fa-xmark" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="summary-chat-log-button">
                        <button
                        @click="loadTextFromFile"
                        >
                        {{ $t(l.summary_log_button) }}
                        </button>
                    </div>
                </div>
        </div>
        <div class="summary-cbr-icf-panel">
            <div class="summary-cbr-icf-title"> {{ $t(l.summary_classification_title) }} </div>
                <div class="summary-cbr-icf-content">
                    <div class="summary-cbr-icf-logo">
                        <img class="summary-cbr-icf-logo-image" src="@/assets/logos/Conversation-topic-logo.png" alt="Logo">    
                    </div>
                    <div class="summary-cbr-icf-text">
                        <p> this is cbr/ocf clasificartion some text here lorem ipsum blab bla blasome text here lorem ipsum blab bla blasome text here lorem ipsum blab bla blasome text here lorem ipsum blab bla blasome text here lorem ipsum blab bla bla</p>
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
        <button
            class="summary-toggle-button-icon"
            v-if="isSmallDevice"
            @click="toggleSummary()"
        >
        <font-awesome-icon icon="fa-solid fa-sliders" />
    
    </button>
        
    </div>

</template>


<style scoped>

.summary-wrapper{
    position: absolute;
    top: 0;
    right: 4rem;
    width: 15%;
    height: 94%;
    margin: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.summary-chat-log-panel{
    background-color:var(--panel-background-color);
    border-radius: 10px;
    margin-bottom: 2rem;
    padding: 2rem;
    min-height: 50%;
}
.summary-chat-log-title{
    display: flex;
    justify-content: center;
    font-size: larger;
}

.summary-chat-log-content{
    display: flex;
    flex-direction: column;
}
.summary-chat-log-text{
    display: flex;
    flex-wrap: wrap;
}
.summary-chat-log-words{
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
}
.summary-chat-log-word{
    width: fit-content;
    display: flex;
    justify-content: center;
    margin-right: 0.3rem;
    height: 2rem;
}
.summary-chat-log-array-words{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
}
.summary-chat-log-array-word{
    margin-right: 1rem;
}
.summary-chat-log-array-word-button{
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
.summary-chat-log-button{
    display: flex;
    justify-content: center;
}
.summary-cbr-icf-panel{
    background-color:var(--panel-background-color);
    border-radius: 10px;
    margin-bottom: 2rem;
    padding: 2rem;
}
.summary-cbr-icf-title{
    display: flex;
    justify-content: center;
    font-size: larger;
}
.summary-cbr-icf-content{
    display: flex;
    flex-direction: column;
}
.summary-cbr-icf-logo{
    display: flex;
    justify-content: center;
    padding: 1rem;

}
.summary-cbr-icf-logo-image{

}
.summary-cbr-icf-button{
    display: flex;
    justify-content: center;
    margin-top: 5rem;
}

.summary-toggle-button{
    position: absolute;
    bottom: 4.5rem;
    right: 0.5rem;
    border-radius: 50px;
}
.summary-toggle-button-icon{
    width: 1.3rem;
    height: 1.3em;
    display: flex;
    align-items: center;
    padding: 0;
    justify-content: center;
}
/* mobile*/
@media screen and (max-width: 600px) {
    .summary-wrapper{
        top: 0px;
        right: 0;
        left: 2.5rem;
        width: 70%;
        overflow: scroll;
    }
    .summary-chat-log-title{
        font-size: medium;
    }
    
    .summary-cbr-icf-text{
        font-size: x-small;
    }
    .summary-cbr-icf-title{
        font-size: medium;

    }
    .summary-chat-log-content{
     
    }

    .summary-chat-log-words{
      
    }
    .summary-chat-log-word{
        font-size: xx-small;
        margin: 0.4rem;
        padding: 0.3rem;
    }
    .summary-chat-log-button{
        margin-top: 1rem;
    }
    .summary-cbr-icf-panel{
    
    }
    input[type=submit],  button {
    

    &:hover {
      color: white;
      border-color: white;
    }
  }
}
</style>