<script setup lang="ts">
import { ref } from "vue";

import { type Formulario, useFormularios } from "../composables/useFormularios";

const props = defineProps<{
  item: Formulario | null;
}>();

const showDialogDelete = defineModel<boolean>();

const { deleteFormulario } = useFormularios();

async function submit() {
  await handleDeleteFormulario();
}

async function handleDeleteFormulario() {
  try {
    const formulario = props.item;
    if (formulario != null) {
      await deleteFormulario(formulario.id);
      return;
    }
    console.error("No se ha pasado ningun formulario");
  } catch (error) {
    console.log("Error al eliminar el formulario", error);
  }
}
</script>

<template>
  <v-dialog v-model="showDialogDelete">
    <v-card>
      <v-card-title>
        <span class="text-h5"> Eliminar formulario </span>
      </v-card-title>

      <v-card-text>
        <div>¿Está seguro de que desea eliminar este formulario?</div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDialogDelete = false"
          >Cancelar</v-btn
        >
        <v-btn color="primary" text @click="submit"> Eliminar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
