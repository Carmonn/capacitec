<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import DataTable from "@/components/base/DataTable.vue";
import CreateCapacitacionDialog from "@/components/capacitacionesView/CreateCapacitacionDialog.vue";
import DeleteCapacitacionDialog from "@/components/capacitacionesView/DeleteCapacitacionDialog.vue";

import {
  type Capacitacion,
  useCapacitaciones,
} from "@/composables/useCapacitaciones";
import { useDialog } from "@/composables/useDialog";

const headers = ref([
  { title: "Fecha de realización", value: "hRealizacion" },
  { title: "Formulario", value: "hFormulario" },
  { title: "Estado", value: "hEstado" },
  { title: "Municipio", value: "hMunicipio" },
  { title: "Cliente", value: "hCliente" },
  { title: "Participantes", value: "hParticipantes" },
  { title: "Acciones", value: "hActions", sortable: false },
]);
const items = ref<Capacitacion[]>([]);

const { getCapacitaciones } = useCapacitaciones();
async function handleGetCapacitaciones() {
  try {
    const capacitaciones = await getCapacitaciones();
    if (!capacitaciones) items.value = [];
    else items.value = capacitaciones;
    console.log("Capacitaciones obtenidas:", capacitaciones);
  } catch (error) {
    console.error("Error al obtener las capacitaciones:", error);
  }
}
onMounted(async () => {
  await handleGetCapacitaciones();
});

const {
  dialogControl,
  dialogMode,
  dialogItem,
  setCreateDialog,
  setDeleteDialog,
} = useDialog<Capacitacion>();
const capacitacionDialogComponent = computed(() => {
  if (dialogMode.value == "create") {
    return CreateCapacitacionDialog;
  } else {
    return DeleteCapacitacionDialog;
  }
});
</script>

<template>
  <component
    :is="capacitacionDialogComponent"
    v-model="dialogControl"
    :item="dialogItem"
  ></component>

  <v-container>
    <v-row>
      <v-col>
        <h2>Capacitaciones</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="success" @click="setCreateDialog()"> Agregar </v-btn>
        <DataTable :items="items" :headers="headers">
          <template #[`item.hActions`]="{ item }">
            <v-btn color="error" @click="setDeleteDialog(item)">
              Eliminar
            </v-btn>
          </template>
        </DataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
