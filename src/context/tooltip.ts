// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { computed, reactive } from 'vue';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipData {
    text: string;
    rect: DOMRect;
    position: TooltipPosition;
}

export class TooltipState {
    private tooltip: TooltipData | null = null;
    private active?: HTMLElement | null = null;

    public set(element: HTMLElement, text: string, position: TooltipPosition) {
        this.active = element;
        const rect = element.getBoundingClientRect();

        this.tooltip = {
            text: text,
            rect: rect,
            position: position
        };

        console.log("Tooltip set", this.tooltip);
    }

    public get() {
        return computed(() => this.tooltip);
    }

    public getActiveElement() {
        return this.active;
    }

    public clear() {
        this.active = null;
        this.tooltip = null;
    }

    public register(element: HTMLElement, text: string, position: TooltipPosition) {
        element.onmouseenter = (e: MouseEvent) => {
            tooltipContext.set(element, text, position);
        };
        element.onmouseleave = (e: MouseEvent) => {
            tooltipContext.clear();
        }
        element.onclick = (e: MouseEvent) => {
            tooltipContext.clear();
        }
    }
}

const tooltipContext = reactive(new TooltipState());
export function useTooltip() {
    return tooltipContext;
}
