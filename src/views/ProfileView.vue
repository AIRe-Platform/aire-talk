<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { router } from "@/router";
import { l } from "@/locales";
import { AireServices, AireScope } from "aire";
import ProfileForm from "@/components/profile/ProfileForm.vue";
import ProfileConnections from "@/components/profile/ProfileConnections.vue";
import ProfilePersonalData from "@/components/profile/ProfilePersonalData.vue";
import ProfilePasswordForm from "@/components/profile/ProfilePasswordForm.vue";
import ProfileDeletionForm from "@/components/profile/ProfileDeletionForm.vue";
import Separator from "@/components/common/Separator.vue";
import ProfileExperiments from "@/components/profile/ProfileExperiments.vue";

const navigateTo = (path: string) => {
    router.push(path);
}

const show_experiments = (AireServices.ID?.getScopes() || [])
    .findIndex(x => x.startsWith("experimental-")) > -1;
</script>

<template>
    <div class="profile-view">
        <div class="profile-content">
            <div class="icon close-window xmark-icon tooltip"
                 @click="navigateTo('/chat')"
                 tabindex="0"
                 role="link"
                 @keypress.prevent.space.enter="navigateTo('/chat')">
                <span class="tooltiptext">{{
                    $t(l.tooltip_close) }}</span>
            </div>
        </div>
        <div class="profile-header">
            <div class="profile-logo">
                <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
            </div>
            <div class="profile-header-text">
                <h3>{{ $t(l.profile_title) }}</h3>
            </div>
        </div>
        <div class="profile-section" v-if="AireServices.ID?.hasScope(AireScope.ProfileEdit)">
            <ProfileForm />
        </div>
        <Separator />
        <template v-if="show_experiments">
            <div class="profile-section">
                <ProfileExperiments />
            </div>
            <Separator />
        </template>
        <div class="profile-section" v-if="AireServices.ID?.hasScope(AireScope.ProfileConnect)">
            <ProfileConnections />
        </div>
        <Separator />
        <div class="profile-section" v-if="AireServices.ID?.hasScope(AireScope.PasswordChange)">
            <ProfilePasswordForm />
        </div>
        <Separator />
        <div class="profile-section" v-if="AireServices.ID?.hasScope(AireScope.ProfileRead)">
            <ProfilePersonalData />
        </div>
        <Separator />
        <div class="profile-section" v-if="AireServices.ID?.hasScope(AireScope.ProfileDelete)">
            <ProfileDeletionForm />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profile-view {
    display: flex;
    /*     overflow: hidden;
 */
    flex-direction: column;
    margin: auto;
    padding: 0rem;
    width: 100%;
    max-width: 986px;
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border-color: var(--panel-border-color);
    margin-top: 1rem;
    position: relative;
}

.xmark-icon {
    position: absolute;
    right: 1rem;
    top: 1rem;
}

.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    padding-bottom: 2rem;
    border-bottom-style: solid;
    border-color: var(--accent-primary-color);
    width: 85%;
    padding-top: 2rem;
}

.section-separator {
    width: 85%;
    align-self: center;
}

.profile-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    gap: 1rem;
    align-items: center;
}

.profile-section {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    background-color: var(--panel-background-color);

    /*     overflow: hidden; */
    &>* {
        margin: 2rem 3rem;
    }
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .profile-view {
        padding: 2rem 0rem;
        width: 95%;
    }

    .profile-section {
        &>* {
            margin: 2rem 1rem;
        }
    }
}
</style>
