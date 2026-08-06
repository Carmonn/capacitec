<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store.ts";

const authStore = useAuthStore();
onMounted(() => {
  authStore.initialize();
});
</script>

<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-text-main {
  color: rgb(var(--v-theme-text-primary));
}
</style>
