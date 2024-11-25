<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { downloadObjectAsJson } from '@/helpers/download';
import { l } from '@/locales';
import { AireServices, AireStatus } from 'aire';
import { reactive } from 'vue';
import Tooltip from "@/components/common/Tooltip.vue";

const state = reactive<{
    busy: boolean,
    error?: string
}>({
    busy: false,
})

const onDownload = () => {
    if (AireServices.ID) {
        state.busy = true;
        state.error = undefined;

        AireServices.ID.getPersonalData()
            .then(res => {
                if (res.status === AireStatus.Success && res.data) {
                    downloadObjectAsJson(res.data, "aire-personal-data.json");
                }
                else {
                    throw l.error_generic;
                }
            })
            .catch(err => {
                console.error(err);
                state.error = l.error_generic;
            })
            .finally(() => { state.busy = false; })
    }
}
</script>

<template>
    <div class="profile-personal-data">
        <h3 class="profile-personal-data-heading">{{ $t(l.profile_heading_personal_data) }}</h3>
        <div class="profile-personal-data-description">
            {{ $t(l.profile_description_personal_data) }}
        </div>
        <div class="profile-personal-data-error" v-if="state.error">
            {{ $t(state.error) }}
        </div>
        <Tooltip :text="$t(l.tooltip_download)" position="top" :useMaxContent="false" :adjustPosition="true">
            <button class="btn profile-personal-data-button" @click="onDownload" :disabled="state.busy">
                {{ $t(l.profile_button_download_personal_data) }}
            </button>
        </Tooltip>

    </div>
</template>

<style scoped>
.profile-personal-data {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.profile-personal-data-description {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background-color: var(--panel-menu-background-color);
    line-height: 1.6rem;
}

.profile-personal-data-button {
    align-self: center;
}

.profile-personal-data-error {
    color: var(--background-color);
    font-size: var(--font-small);
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background-color: var(--error-color);
    align-self: center;
}
</style>