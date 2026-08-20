<script setup lang="ts">
import { useStatus } from "@/composables/useStatus";
import { useCapacitaciones } from "../composables/useCapacitaciones";
import { type Capacitacion } from "../schemas";

const props = defineProps<{
  item: Capacitacion;
}>();
const emit = defineEmits<{
  deleted: [id: string];
  crashed: [error: unknown];
}>();

const { deleteCapacitacion } = useCapacitaciones();
const { isLoading, status, resetStatus } = useStatus();
const showDialogDelete = defineModel<boolean>();
async function submit() {
  try {
    status.value = "loading";
    const capacitacion = props.item;
    await deleteCapacitacion(capacitacion.id!);
    status.value = "success";
    emit("deleted", capacitacion.id!);
    resetStatus();
  } catch (error) {
    status.value = "error";
    console.log("Error al eliminar la capacitación", error);
    emit("crashed", error);
  }
}
</script>

<template>
  <v-dialog v-model="showDialogDelete">
    <v-card>
      <v-card-title>
        <span class="text-h5"> Eliminar capacitación </span>
      </v-card-title>

      <v-card-text>
        <div>¿Está seguro de que desea eliminar esta capacitación?</div>
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
