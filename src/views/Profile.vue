<script setup lang="ts">
import { l } from "@/locales";
import { AireServices } from "@/lib/aire";
import { defineComponent} from "vue";
import { AireScope } from "@/lib/aire/models/scopes";
import ProfileForm from "@/components/profile/ProfileForm.vue";
import ProfileConnections from "@/components/profile/ProfileConnections.vue";
import ProfilePasswordForm from "@/components/profile/ProfilePasswordForm.vue";
import ProfileDeletionForm from "@/components/profile/ProfileDeletionForm.vue";

defineComponent({ name: "ProfileView" });
</script>

<template>
    <div class="profile-view">
        <div class="profile-content">
            <div class="profile-header">
                <div class="profile-logo">
                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                </div>
                <div class="profile-header-text">
                    <h3>{{ $t(l.profile_title) }}</h3>
                </div>
            </div>
            <template v-if="AireServices.ID?.hasScope(AireScope.ProfileEdit)">
                <div class="profile-section">
                    <ProfileForm />
                </div>
                <div class="profile-section">
                    <ProfileConnections />
                </div>
                <div class="profile-section">
                    <ProfilePasswordForm />
                </div>
            </template>
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
    padding: 4rem 1rem;
    width: 100%;
    max-width: 986px;
}

.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 2rem;
    border-bottom-style: solid;
    border-color: var(--accent-primary-color);
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
}

.profile-section {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    border-bottom-style: dotted;
    background-color: var(--panel-background-color);
    overflow: hidden;

    * {
        margin: 1rem 3rem 2rem 3rem;
    }
}

@media screen and (max-width: 600px) {
    .profile-view {
        padding: 2rem 0rem;
    }
}
</style>
