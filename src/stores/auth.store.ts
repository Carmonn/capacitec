import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { User } from "firebase/auth";
import { useAuth } from "@/composables/useAuth";

export const useAuthStore = defineStore("auth", () => {
  const { login: firebaseLogin, logout: firebaseLogout, subscribe } = useAuth();

  const user = ref<User | null>(null);
  const loading = ref(false);
  const isAuthenticated = computed(() => user.value !== null);
  const initialized = ref(false);

  const initialize = () => {
    subscribe((firebaseUser) => {
      user.value = firebaseUser;
      initialized.value = true;
    });
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      await firebaseLogin(email, password);
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await firebaseLogout();
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    login,
    logout,
    initialize,
  };
});
