<!--
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
import {
    ITutorial,
    ChatTutorialState,
    HomeTutorialState,
    NavMenuTutorialState,
    TutorialStates,
} from '@/context/tutorials';
import { UIState } from '@/context/ui';
import { l } from '@/locales';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const props = defineProps<{
    tutorial: ITutorial<HomeTutorialState | NavMenuTutorialState | ChatTutorialState>;
}>();

const route = useRoute();
const i18n = useI18n();

const popupRef = ref<HTMLElement | null>(null);

function trySetPosition(): void {
    nextTick(() => {
        if (_positionSet()) return;

        let retries = 5;
        let interval = setInterval(() => {
            if (retries <= 0)
                clearInterval(interval);
            retries--;
            if (_positionSet())
                clearInterval(interval);
        }, 500);
    })

    function _positionSet(): boolean {
        const el = document.querySelector(`[data-tutorial-state="${props.tutorial.state}"]`);
        if (!el)
            return false;
        if (!popupRef.value)
            return false;
        props.tutorial.calculatePosition(
            el.getBoundingClientRect(),
            popupRef.value.getBoundingClientRect()
        );
        return true;
    }
}

function resizeListener(): void {
    trySetPosition();
}

watch(() => props.tutorial.state, () => {
    trySetPosition();
});
watch(route, (newRoute) => {
    if (props.tutorial.shouldShow(newRoute))
        trySetPosition();
});
// This sets the menu tutorial positions properly.
watch(() => UIState.showMenu, () => {
    if (props.tutorial.shouldShow(route)) {
        setTimeout(trySetPosition, 250); // Same duration as the transition duration in `.nav-menu`.
    }
});
// This resets the chat tutorial positions when sidepanel is toggled.
watch(TutorialStates, (newState) => {
    if (newState.shouldUpdatePosition && props.tutorial.shouldShow(route)) {
        newState.shouldUpdatePosition = false;
        setTimeout(trySetPosition, 250); // Same duration as the transition duration in `.chat-side-panel`.
    }
});

onMounted(() => {
    props.tutorial.tryGetState();
    if (props.tutorial.shouldShow(route))
        trySetPosition();
    window.addEventListener('resize', resizeListener);
});

onUnmounted(() => window.removeEventListener('resize', resizeListener));

const message = computed(() => {
    const key = `tutorial_${props.tutorial.state}_message`;
    return i18n.t(key);
});
const positionStyle = computed(() => {
    return !props.tutorial.position ? {} : {
        top: props.tutorial.position.top !== undefined ? `${props.tutorial.position.top}px` : 'unset',
        bottom: props.tutorial.position.bottom !== undefined ? `${props.tutorial.position.bottom}px` : 'unset',
        left: props.tutorial.position.left !== undefined ? `${props.tutorial.position.left}px` : 'unset',
        right: props.tutorial.position.right !== undefined ? `${props.tutorial.position.right}px` : 'unset',
    };
});
const opacityStyle = computed(() => ({ opacity: props.tutorial.isVisible(route) ? 1 : 0 }));
</script>

<template>
    <div ref="popupRef"
        class="tutorial-pupup"
        :class="[props.tutorial.trianglePosition]"
        :style="[positionStyle, opacityStyle]">
        <span>{{ message }}</span>
        <div class="tutorial-buttons">
            <button class="btn" type="button" @click="props.tutorial.skip"
                :tabindex="props.tutorial.isVisible($route) ? 0 : -1">
                {{ $t(props.tutorial.isLastState() ? l.tutorial_done : l.tutorial_skip) }}
            </button>
            <button class="btn" type="button"
                :tabindex="props.tutorial.isVisible($route) ? 0 : -1"
                v-show="!props.tutorial.isLastState()"
                @click="props.tutorial.next">
                {{ $t(l.tutorial_next) }}
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tutorial-pupup {
    --spacing: 1rem;
    display: grid;
    gap: calc(var(--spacing) / 2);
    max-width: 32ch;
    padding: calc(var(--spacing) / 2) var(--spacing);
    border-radius: var(--spacing);
    position: absolute;
    z-index: 8;
    box-shadow: 0 0 calc(var(--spacing) * 1.5) rgb(43, 43, 43);
    transition: opacity 350ms ease-in-out;
    background-color: #fff;

    span {
        color: black;
        text-align: center;
    }

    .tutorial-buttons {
        display: flex;
        gap: inherit;
        justify-content: flex-end;
    }

    &::after {
        content: '';
        position: absolute;
        height: var(--spacing);
        aspect-ratio: 1;
        background-color: inherit;
    }

    &.bottom-left::after,
    &.bottom-middle::after,
    &.bottom-right::after {
        clip-path: polygon(0 0, 50% 100%, 100% 0);
        bottom: calc(var(--spacing) * -1);
    }

    &.bottom-left::after {
        left: calc(30% - var(--spacing) / 2);
    }

    &.bottom-middle::after {
        left: calc(50% - var(--spacing) / 2);
    }

    &.bottom-right::after {
        left: calc(75% - var(--spacing) / 2);
    }

    &.left-top::after,
    &.left-middle::after {
        clip-path: polygon(100% 0, 0 50%, 100% 100%);
        left: calc(var(--spacing) * -1);
    }

    &.left-top::after {
        top: calc(25% - var(--spacing) / 2);
    }

    &.left-middle::after {
        top: calc(50% - var(--spacing) / 2);
    }

    &.right-bottom::after {
        clip-path: polygon(0 0, 0% 100%, 100% 50%);
        right: calc(var(--spacing) * -1);
        top: calc(75% - var(--spacing) / 2);
    }
}

.neg-margin {
    margin-inline-end: -2.5rem;
}
</style>
