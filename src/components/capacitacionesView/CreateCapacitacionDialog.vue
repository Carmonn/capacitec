<script setup lang="ts">
import { ref } from "vue";

import {
  type Capacitacion,
  useCapacitaciones,
} from "@/composables/useCapacitaciones";

const props = defineProps<{
  item: Capacitacion | null;
}>();

const showDialogCreate = defineModel<boolean>();

const { addCapacitacion } = useCapacitaciones();
const selectedFile = ref<File | null>(null);

async function submit() {
  await handleAddCapacitacion();
}

async function handleAddCapacitacion() {
  try {
    // const capacitacionId = await addCapacitacion();
    // console.log("Capacitación agregada con ID:", capacitacionId);
  } catch (error) {
    console.error("Error al agregar la capacitación:", error);
  }
}
</script>

<template>
  <v-dialog v-model="showDialogCreate">
    <v-card>
      <v-card-title>
        <span class="text-h5"> Agregar capacitación </span>
      </v-card-title>

      <v-card-text>
        <div>
          <v-file-input
            v-model="selectedFile"
            label="Subir archivo JSON"
            accept=".json"
            outlined
            dense
          ></v-file-input>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDialogCreate = false"
          >Cancelar</v-btn
        >
        <v-btn color="primary" text @click="submit"> Agregar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
