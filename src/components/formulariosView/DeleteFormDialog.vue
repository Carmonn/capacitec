<script setup lang="ts">
import { ref } from "vue";

import { type Form, useForms } from "@/composables/useForms";

const props = defineProps<{
  item: Form | null;
}>();

const showDialogDelete = defineModel<boolean>();

const { deleteForm } = useForms();

async function submit() {
  await handleDeleteForm();
}

async function handleDeleteForm() {
  try {
    const form = props.item;
    if (form != null) {
      await deleteForm(form.id);
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
