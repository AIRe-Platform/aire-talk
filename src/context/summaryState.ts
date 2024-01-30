import { reactive } from "vue";

export interface SummaryState {
    isSummaryOpen: boolean;
}

export const SummaryState: SummaryState = reactive(initSummaryState());

function initSummaryState(): SummaryState {
    return {
        isSummaryOpen: false,
    }
}