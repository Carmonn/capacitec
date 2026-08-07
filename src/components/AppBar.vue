<script setup lang="ts">
import { computed, ref } from "vue";
import { useNavigation } from "@/composables/useNavigation";

const drawer = ref(false);
function toggleDrawer() {
  drawer.value = !drawer.value;
}

const navIcon = computed(() => (drawer.value ? "mdi-backburger" : "mdi-menu"));

const { navigationRoutes } = useNavigation();
</script>

<template>
  <v-app-bar color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon :icon="navIcon" @click="toggleDrawer" />
    </template>

    <v-app-bar-title>Capacitec</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" color="primary-lighten-1" class="py-5">
    <v-list class="px-2 py-2">
      <v-btn
        v-for="item in navigationRoutes"
        :key="item.path"
        :to="item.path"
        block
        rounded="xl"
        size="large"
        class="mb-2 justify-start text-none"
        :prepend-icon="item.icon"
        color="secondary"
        variant="flat"
      >
        {{ item.label }}
      </v-btn>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
