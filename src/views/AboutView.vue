<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import AccessibilityStatement from '@/components/about/AccessibilityStatement.vue';
import PrivacyStatement from '@/components/about/PrivacyStatement.vue';
import TermsOfUse from '@/components/about/TermsOfUse.vue';
import SupportMailto from '@/components/common/SupportMailto.vue';
import useTheme from '@/context/theme';
import { getUILanguage, l } from '@/locales';
import { reactive } from 'vue';

const state = reactive<{
    open?: 'tos' | 'privacy' | 'accessibility',
}>({});

const darkTheme = useTheme().isDarkTheme();
const lang = getUILanguage();

const toggleTermsModal = () => { state.open = 'tos'; };
const togglePrivacyModal = () => { state.open = 'privacy'; };
const toggleAccessibilityModal = () => { state.open = 'accessibility'; };
</script>

<template>
    <div class="about-view">
        <div class="about-menu">
            <h1>{{ $t(l.about_title) }}</h1>
            <div class="btn-container">
                <button type="button" class="btn" @click="toggleTermsModal">
                    {{ $t(l.about_tou) }}
                </button>
                <button type="button" class="btn" @click="togglePrivacyModal">
                    {{ $t(l.about_privacy_policies) }}
                </button>
                <button type="button" class="btn" @click="toggleAccessibilityModal">
                    {{ $t(l.about_accessibility) }}
                </button>
                <SupportMailto />
            </div>
            <div class="collab-container">
                <h2>{{ $t(l.about_collaboration) }}</h2>
                <div class="images-container">
                    <a href="https://www.goodlife.technology" target="_blank">
                        <img id="goodlife-logo" src="@/assets/images/GoodLife_Logo_white -2023.png"
                            :alt="$t(l.about_goodlife_logo_alt)">
                    </a>
                    <a href="https://www.jamk.fi/fi" target="_blank">
                        <template v-if="darkTheme">
                            <img v-if="lang === 'fi'" src="@/assets/images/jamk_tunnus_valkoinen_nimella_suomi.png"
                                :alt="$t(l.about_jamk_logo_alt)">
                            <img v-else src="@/assets/images/jamk_tunnus_valkoinen_nimella_englanti.png"
                                :alt="$t(l.about_jamk_logo_alt)">
                        </template>
                        <template v-else>
                            <img v-if="lang === 'fi'" src="@/assets/images/jamk_tunnus_sininen_nimella_suomi.png"
                                :alt="$t(l.about_jamk_logo_alt)">
                            <img v-else src="@/assets/images/jamk_tunnus_sininen_nimella_englanti.png"
                                :alt="$t(l.about_jamk_logo_alt)">
                        </template>
                    </a>
                </div>
            </div>
        </div>
        <div class="about-container" tabindex="0">
            <div class="about-subcontainer" v-if="state.open === 'tos'">
                <div class="about-content">
                    <TermsOfUse />
                </div>
            </div>
            <div class="about-subcontainer" v-else-if="state.open === 'privacy'">
                <div class="about-content">
                    <PrivacyStatement />
                </div>
            </div>
            <div class="about-subcontainer" v-else-if="state.open === 'accessibility'">
                <div class="about-content">
                    <AccessibilityStatement />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.about-view {
    display: flex;
    width: 100%;
    height: 100%;
}

.about-menu {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    font-size: larger;
    padding-inline: 3rem;
    margin-block-start: 10rem;
    width: 20%;

    &>.btn-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-block-start: 2rem;
    }
}

.about-container {
    background-color: var(--page-background);
    border-left: 2px solid var(--panel-border-color);
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.about-subcontainer {
    background-color: #FFF;
    color: black;
    width: 80%;
    flex-grow: 1;
    padding: 2rem;
    margin-block: 2rem;
}

.images-container {
    display: flex;

    a,
    img {
        width: 100%;
        height: auto;
    }
}

.collab-container {
    margin-block-start: auto;
}

.about-content {
    a {
        color: var(--button-color);
    }

    p {
        margin-bottom: 1rem;
    }
}

.theme-default {
    #goodlife-logo {
        background-color: var(--button-color);
    }
}

.support-mailto {
    p {
        text-align: left;
        font-size: var(--font-small)
    }

    align-items: start;
    gap: 0.5rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .about-view {
        flex-direction: column;
    }

    .about-menu {
        margin-block-start: 0.5rem;
        height: auto;
        width: auto;
        padding: 0;

        &>h1 {
            text-align: end;
            margin-block-start: 0.5rem;
            margin-inline-end: 0.5rem;
        }

        &>.btn-container {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-block-start: 1.5rem;
            margin-inline: 0.5rem;

            &>.btn {
                flex: 1 1 5rem;
            }
        }
    }

    .about-container {
        font-size: var(--font-small);
        border-left: unset;
        border-top: 2px solid var(--panel-border-color);
        margin-block-start: 0.5rem;
    }

    .about-subcontainer {
        width: auto;
        margin-inline: 1rem;
    }

    .collab-container {
        display: none;
    }
}
</style>
