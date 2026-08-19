import { ref } from "vue";

type SnackbarType = "success" | "error" | "info" | "warning";

export function useSnackbar() {
  const snackbar = ref(false);
  const snackbarMessage = ref("");
  const snackbarType = ref<SnackbarType>("success");
  const timeout = ref(4000);

  function showSnackbar(message: string, type: SnackbarType = "success") {
    snackbarMessage.value = message;
    snackbarType.value = type;
    snackbar.value = true;
  }

  return {
    snackbar,
    snackbarMessage,
    timeout,
    snackbarType,
    showSnackbar,
  };
}
