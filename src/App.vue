<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

const isDark = computed(() => theme.global.name.value === "darkTheme");

function toggleTheme() {
  theme.global.name.value = isDark.value ? "lightTheme" : "darkTheme";
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="py-12">
        <v-card
          class="mx-auto pa-6"
          max-width="680"
          color="surface"
          elevation="2"
        >
          <h1 class="text-h4 mb-3 text-primary">Capacitec + Vuetify</h1>
          <p class="text-body-1 app-text-main mb-4">
            Vuetify 4.1.6 se instaló correctamente y el tema global ahora usa la
            paleta corporativa.
          </p>
          <v-btn
            class="mb-4"
            color="primary"
            variant="outlined"
            prepend-icon="mdi-theme-light-dark"
            @click="toggleTheme"
          >
            {{ isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro" }}
          </v-btn>
          <div class="d-flex flex-wrap ga-3">
            <v-btn color="primary" variant="flat">Primario</v-btn>
            <v-btn color="secondary" variant="flat">Secundario</v-btn>
            <v-btn color="accent" variant="tonal">Acento Claro</v-btn>
          </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-text-main {
  color: rgb(var(--v-theme-text-primary));
}
</style>
