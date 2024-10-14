<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import Modal from '@/components/common/Modal.vue';
import { onMounted, reactive, defineComponent } from 'vue';
import { AireEvent, AireServices, AireStatus } from 'aire';
import Separator from './Separator.vue';
import { DateTime } from 'luxon';

defineComponent({ name: "EventComponent" })

const state = reactive<{
    events: AireEvent[],
    visible: boolean
}>({
    events: [],
    visible: true,
});

const checkForEvents = () => {
    if (AireServices.Memory) {

        AireServices.Memory.getEvents()
            .then(res => {
                let unixNow = Date.now() / 1000;
                if (res.status === AireStatus.Success && res.data) {
                    state.events = res.data.filter(event => {
                        if (event.trigger_timestamp < unixNow && event.read_timestamp == null)
                            return event;
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
}

const markEventAsRead = (event: AireEvent) => {
    if (AireServices.Memory) {
        event.read_timestamp = Math.floor(Date.now() / 1000);
        AireServices.Memory.editEvent(event)
            .then(res => {
                if (res === AireStatus.Success) {
                    checkForEvents();
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
}

const closeModal = () => { state.visible = false; }

onMounted(async () => {
    checkForEvents();
})

</script>

<template>
    <Modal :active="state.events.length > 0 && state.visible" :showCloseButton="true" @close="closeModal">
        <div class="event-panel" v-for="(event, index) in state.events" :key="index">
            <Separator />
            <div class="event-date">
                {{ DateTime.fromSeconds(event.trigger_timestamp).toLocaleString(DateTime.DATETIME_SHORT) }}
            </div>
            <div class="event-message">
                {{ event.content.message }}
            </div>
            <div class="event-buttons">
                <button @click.stop="markEventAsRead(event)">
                    {{ $t(l.button_mark_as_read) }}
                </button>
            </div>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
.event-panel {
    padding-top: 2em;
}

.event-date {
    font-size: var(--font-small);
    font-family: var(--font-family);
    text-align: center;
    padding-bottom: 1rem;
}

.event-message {
    font-size: var(--font-large);
    font-family: var(--font-family);
    text-align: center;
}

.event-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-top: 1rem;
}
</style>