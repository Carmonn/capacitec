<script setup lang="ts">
import { useStatus } from "@/composables/useStatus";
import { type Formulario, useFormularios } from "../composables/useFormularios";

const props = defineProps<{
  item: Formulario | null;
}>();
const emit = defineEmits<{
  deleted: [id: string];
}>();

const { deleteFormulario } = useFormularios();
const { isLoading, status, errorMessage } = useStatus();
const showDialogDelete = defineModel<boolean>();

async function submit() {
  try {
    status.value = "loading";
    const formulario = props.item;
    if (formulario != null) {
      await deleteFormulario(formulario.id);
      status.value = "success";
      emit("deleted", formulario.id);
      return;
    }
    console.error("No se ha pasado ningun formulario");
  } catch (error) {
    status.value = "error";
    errorMessage.value =
      "No se pudo eliminar el formulario. Por favor, inténtalo de nuevo.";
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
        <v-btn
          color="primary"
          text
          @click="submit"
          :disabled="isLoading"
          :loading="isLoading"
        >
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
