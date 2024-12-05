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
import Tooltip from "@/components/common/Tooltip.vue";
import { onMounted, reactive } from "vue";
import useTheme, { ThemeContext } from "@/context/theme";
import ProfileChatHistoryTokens from "@/components/profile/ProfileChatHistoryTokens.vue";

const state = reactive<{
    theme: ThemeContext,
}>({
    theme: new ThemeContext()
});
const navigateTo = (path: string) => {
    router.push(path);
}

const show_experiments = (AireServices.ID?.getScopes() || [])
    .findIndex(x => x.startsWith("experimental-")) > -1;

onMounted(async () => {
    state.theme = useTheme();

})
</script>

<template>
    <div class="profile-view">
        <div class="profile-content">
            <Tooltip :text="$t(l.tooltip_close)" position="top" :useMaxContent="false" :adjustPosition="true"
                class="xmark-icon">
                <a class="tooltip-inside circle-icon" @click="navigateTo('/chat')"
                    :aria-label="$t(l.tooltip_close)" href="#" @keydown.space="navigateTo('/chat')">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </a>
            </Tooltip>
        </div>
        <div class="profile-header">
            <div class="profile-logo">
                <div class="image-logo" v-if="state.theme.style == 'theme-default'">
                    <img src="@/assets/images/aire-logo-letter.svg" :alt=$t(l.profile_view_alternative_image_logo) />
                </div>
                <div class="image-logo" v-else>
                    <img src="@/assets/images/aire-logo-letter-dark-mode.svg"
                        :alt=$t(l.profile_view_alternative_image_logo_dark_mode) />
                </div>
            </div>
            <div class="profile-header-text">
                <h1>{{ $t(l.profile_title) }}</h1>
            </div>
        </div>
        <div class="profile-section" v-if="AireServices.ID?.hasScope(AireScope.ProfileEdit)">
            <ProfileForm />
        </div>
        <template v-if="show_experiments">
            <Separator />
            <div class="profile-section">
                <ProfileExperiments />
            </div>
        </template>
        <template v-if="AireServices.ID?.hasScope(AireScope.ProfileConnect)">
            <Separator />
            <div class="profile-section">
                <ProfileConnections />
            </div>
        </template>
        <template v-if="AireServices.ID?.hasScope(AireScope.PasswordChange)">
            <Separator />
            <div class="profile-section">
                <ProfilePasswordForm />
            </div>
        </template>
        <template v-if="AireServices.ID?.hasScope(AireScope.ProfileRead)">
            <Separator />
            <div class="profile-section">
                <ProfilePersonalData />
            </div>
        </template>
        <template v-if="AireServices.ID?.hasScope(AireScope.ProfileDelete)">
            <Separator />
            <div class="profile-section">
                <ProfileDeletionForm />
            </div>
        </template>
        <Separator />
        <div class="profile-section">
            <ProfileChatHistoryTokens />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profile-logo {
    width: 12rem;
}

.image-logo {
    width: inherit;
}

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

.tooltip-inside {
    height: 2rem;
    width: 2rem;
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
