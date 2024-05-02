<script setup lang="ts">
import { l } from "@/locales";
import { AireServices, AireScope } from "aire";
import ProfileForm from "@/components/profile/ProfileForm.vue";
import ProfileConnections from "@/components/profile/ProfileConnections.vue";
import ProfilePasswordForm from "@/components/profile/ProfilePasswordForm.vue";
import ProfileDeletionForm from "@/components/profile/ProfileDeletionForm.vue";
import { router } from "@/router";
import SectionSeparator from "@/components/SectionSeparator.vue";

const navigateTo = (path: string) => {
    router.push(path);

}

</script>

<template>
    <div class="profile-view">
        <div class="profile-content">
            <div class="xmark-icon" @click="navigateTo('/chat')">
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
            <SectionSeparator />
            <div class="profile-section" v-if="AireServices.ID?.hasScope(AireScope.ProfileConnect)">
                <ProfileConnections />
            </div>
            <SectionSeparator />
            <div class="profile-section" v-if="AireServices.ID?.hasScope(AireScope.PasswordChange)">
                <ProfilePasswordForm />
            </div>
            <SectionSeparator />
            <div class="profile-section" v-if="AireServices.ID?.hasScope(AireScope.ProfileDelete)">
                <ProfileDeletionForm />
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-view {
    display: flex;
    overflow: hidden;
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
    background-image: url(/src/assets/icons/aire-icon-xmark.svg);
    width: 1.5rem;
    height: 1.5rem;
    background-size: cover;
    position: absolute;
    right: 1rem;
    top: 1rem;
}

.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
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

.profile-logo {
    width: 7rem;
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
    overflow: hidden;

    &>* {
        margin: 2rem 3rem;
    }
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .profile-view {
        padding: 2rem 0rem;
    }

    .profile-section {
        &>* {
            margin: 2rem 1rem;
        }
    }
}
</style>
