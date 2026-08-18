<script setup lang="ts" generic="T">
import { useSlots } from "vue";

defineProps<{
  items: T[];
  headers: {
    title: string;
    value: string;
    sortable?: boolean;
  }[];
}>();

const slots = useSlots();
</script>

<template>
  <div>
    <v-data-table :items="items" :headers="headers">
      <template v-for="(_, name) in slots" :key="name" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </v-data-table>
  </div>
</template>
