<script setup lang="ts">
import { ref } from "vue";

import {
  type Capacitacion,
  useCapacitaciones,
} from "../composables/useCapacitaciones";

const props = defineProps<{
  item: Capacitacion | null;
}>();

const showDialogDelete = defineModel<boolean>();

const { deleteCapacitacion } = useCapacitaciones();

async function submit() {
  await handleDeleteCapacitacion();
}

async function handleDeleteCapacitacion() {
  try {
    const capacitacion = props.item;
    if (capacitacion != null) {
      await deleteCapacitacion(capacitacion.id!);
      return;
    }
    console.error("No se ha pasado ninguna capacitación");
  } catch (error) {
    console.log("Error al eliminar la capacitación", error);
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
        <v-btn color="primary" text @click="submit"> Eliminar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
