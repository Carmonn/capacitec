<script setup lang="ts" generic="T">
import { computed, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    items: T[];
    headers: {
      title: string;
      value: string;
      sortable?: boolean;
      align?: "start" | "center" | "end";
    }[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const slots = useSlots();
const passthroughSlotNames = computed(() =>
  Object.keys(slots).filter((name) => name !== "loading" && name !== "no-data"),
);
</script>

<template>
  <div>
    <v-data-table
      :items="items"
      :headers="headers"
      :loading="loading"
      loading-text="Cargando datos..."
    >
      <template #no-data>
        <div
          class="d-flex flex-column align-center justify-center py-8 text-medium-emphasis"
        >
          <v-icon icon="mdi-database-off-outline" size="32" class="mb-2" />
          <span>No hay elementos para mostrar.</span>
        </div>
      </template>

      <template
        v-for="name in passthroughSlotNames"
        :key="name"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps" />
      </template>
    </v-data-table>
  </div>
</template>
