import { ref } from 'vue';

export const isSpinnerVisible = ref(false);
export const spinnerMessage = ref('');
export enum SpinnerId {
  SignUpView = 'signup-view-spinner',
  LoginView = 'login-view-spinner',
  ProfileExperiments = 'profile-experiments-spinner',
  ChatHistory = 'chat-history-spinner',
}

export function showSpinner(id: SpinnerId) {
  isSpinnerVisible.value = true;
  spinnerMessage.value = '';

  setTimeout(() => {
    spinnerMessage.value = 'The page is loading, please wait a moment.';
    document.getElementById(id)?.focus();
  }, 100); // Delay to ensure screen readers detect the change
}

export function hideSpinner() {
  isSpinnerVisible.value = false;
  spinnerMessage.value = '';
}
