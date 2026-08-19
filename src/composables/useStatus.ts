import { ref, computed } from "vue";

type Status = "idle" | "loading" | "success" | "error";

export function useStatus() {
  const status = ref<Status>("idle");
  const errorMessage = ref<string | null>(null);

  const isLoading = computed(() => status.value === "loading");

  return {
    status,
    isLoading,
    errorMessage,
  };
}
