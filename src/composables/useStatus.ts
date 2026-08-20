import { ref, computed } from "vue";

type Status = "idle" | "loading" | "success" | "error";

export function useStatus() {
  const status = ref<Status>("idle");
  const errorMessage = ref<string | null>(null);

  const isIdle = computed(() => status.value === "idle");
  const isLoading = computed(() => status.value === "loading");
  const isSuccess = computed(() => status.value === "success");
  const isError = computed(() => status.value === "error");

  function resetStatus() {
    status.value = "idle";
    errorMessage.value = null;
  }

  return {
    resetStatus,
    status,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
  };
}
