import { ref } from 'vue';

export const isSpinnerVisible = ref(false);
export const spinnerMessage = ref('');

export function showSpinner() {
  isSpinnerVisible.value = true;
  spinnerMessage.value = '';

  setTimeout(() => {
    spinnerMessage.value = 'The page is loading, please wait a moment.';
  }, 100); // Delay to ensure screen readers detect the change
}

export function hideSpinner() {
  isSpinnerVisible.value = false;
  spinnerMessage.value = '';
}
