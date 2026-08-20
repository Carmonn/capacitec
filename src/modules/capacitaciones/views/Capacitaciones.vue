<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import DataTable from "@/components/DataTable.vue";
import CreateDialog from "../components/CreateDialog.vue";
import DeleteDialog from "../components/DeleteDialog.vue";

import { type Capacitacion } from "../schemas";
import { useCapacitaciones } from "../composables/useCapacitaciones";
import { useDialog } from "@/composables/useDialog";
import { useSnackbar } from "@/composables/useSnackbar";

import { type TableHeader } from "@/types/table.types";

const { snackbar, snackbarMessage, snackbarType, showSnackbar } = useSnackbar();
const { getCapacitaciones } = useCapacitaciones();

const headers = ref<TableHeader[]>([
  { title: "Fecha de capacitación", value: "hFecha" },
  { title: "Formulario", value: "hFormulario" },
  { title: "Cliente", value: "hCliente" },
  { title: "Participantes", value: "hParticipantes", align: "center" },
  { title: "Acciones", value: "hActions", sortable: false, align: "center" },
]);
const items = ref<Capacitacion[]>([]);
const isLoading = ref(false);

async function handleCreated(formularioId: string) {
  dialogControl.value = false;
  showSnackbar("Capacitación creada con éxito", "success");
  await handleGetCapacitaciones();
  console.log("Capacitación creada con ID:", formularioId);
}
async function handleDeleted(formularioId: string) {
  dialogControl.value = false;
  showSnackbar("Capacitación eliminada con éxito", "success");
  await handleGetCapacitaciones();
  console.log("Capacitación eliminada con ID:", formularioId);
}
async function handleGetCapacitaciones() {
  try {
    isLoading.value = true;
    const capacitaciones = await getCapacitaciones();
    if (!capacitaciones) items.value = [];
    else items.value = capacitaciones;
  } catch (error) {
    console.error("Error al obtener las capacitaciones:", error);
  } finally {
    isLoading.value = false;
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
    return CreateDialog;
  } else {
    return DeleteDialog;
  }
});
</script>

<template>
  <component
    :is="capacitacionDialogComponent"
    v-model="dialogControl"
    :item="dialogItem"
    @created="handleCreated"
    @deleted="handleDeleted"
  ></component>

  <v-snackbar v-model="snackbar" :color="snackbarType" :timeout="4000">
    {{ snackbarMessage }}
    <template #actions>
      <v-btn variant="text" @click="snackbar = false"> Cerrar </v-btn>
    </template>
  </v-snackbar>

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
          <template #[`item.hFecha`]="{ item }">
            {{ item.fechaCapacitacion.toLocaleDateString("es-MX") }}
          </template>

          <template #[`item.hCliente`]="{ item }">
            {{ item.cliente }}
          </template>

          <template #[`item.hFormulario`]="{ item }">
            {{ item.nombreFormulario }}
          </template>

          <template #[`item.hParticipantes`]="{ item }">
            {{ item.participantes.length }}
          </template>

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
