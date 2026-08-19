<script setup lang="ts">
import { useStatus } from "@/composables/useStatus";
import { useFormularios } from "../composables/useFormularios";
import { type Formulario } from "../schemas";

const props = defineProps<{
  item: Formulario;
}>();
const emit = defineEmits<{
  deleted: [id: string];
}>();

const { deleteFormulario } = useFormularios();
const { isLoading, status, resetStatus } = useStatus();
const showDialogDelete = defineModel<boolean>();

async function submit() {
  try {
    status.value = "loading";
    const formulario = props.item;
    await deleteFormulario(formulario.id);
    status.value = "success";
    emit("deleted", formulario.id);
    resetStatus();
  } catch (error) {
    status.value = "error";
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
          :disabled="isLoading || status === 'success'"
          :loading="isLoading"
        >
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
