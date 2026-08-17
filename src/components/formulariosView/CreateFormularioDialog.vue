<script setup lang="ts">
import { ref } from "vue";

import { type Formulario, useFormularios } from "@/composables/useFormularios";

const props = defineProps<{
  item: Formulario | null;
}>();

const showDialogCreate = defineModel<boolean>();

const { addFormulario } = useFormularios();
const selectedFile = ref<File | null>(null);

async function submit() {
  await handleAddFormulario();
}

async function handleAddFormulario() {
  try {
    const file = selectedFile.value;
    if (!file) {
      console.error("No se ha seleccionado ningún archivo.");
      return;
    }
    const text = await file.text();
    const formulario = JSON.parse(text);

    const formularioId = await addFormulario(formulario);
    console.log("Formulario agregado con ID:", formularioId);
  } catch (error) {
    console.error("Error al agregar el formulario:", error);
  }
}
</script>

<template>
  <v-dialog v-model="showDialogCreate">
    <v-card>
      <v-card-title>
        <span class="text-h5"> Agregar formulario </span>
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
