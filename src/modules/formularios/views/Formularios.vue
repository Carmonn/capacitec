<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import DataTable from "@/components/DataTable.vue";
import CreateDialog from "../components/CreateDialog.vue";
import DeleteDialog from "../components/DeleteDialog.vue";

import { type Formulario } from "../schemas";
import { useFormularios } from "../composables/useFormularios";
import { useDialog } from "@/composables/useDialog";
import { useSnackbar } from "@/composables/useSnackbar";

import { type TableHeader } from "@/types/table.types";

const { getFormularios } = useFormularios();
const { snackbar, snackbarMessage, snackbarType, showSnackbar } = useSnackbar();

const headers = ref<TableHeader[]>([
  { title: "Fecha de creación", value: "hFechaCreacion" },
  { title: "Nombre del formulario", value: "hNombre" },
  { title: "Total de preguntas", value: "hPreguntas", align: "center" },
  { title: "Acciones", value: "hActions", align: "center" },
]);
const items = ref<Formulario[]>([]);
const isLoading = ref(false);

async function handleCreated(formularioId: string) {
  dialogControl.value = false;
  showSnackbar("Formulario creado con éxito", "success");
  await handleGetFormularios();
  console.log("Formulario creado con ID:", formularioId);
}
async function handleDeleted(formularioId: string) {
  dialogControl.value = false;
  showSnackbar("Formulario eliminado con éxito", "success");
  await handleGetFormularios();
  console.log("Formulario eliminado con ID:", formularioId);
}
async function handleGetFormularios() {
  try {
    isLoading.value = true;
    const formularios = await getFormularios();
    if (!formularios) items.value = [];
    else items.value = formularios;
    console.log("Formularios obtenidos:", formularios);
  } catch (error) {
    console.error("Error al obtener los formularios:", error);
  } finally {
    isLoading.value = false;
  }
}
onMounted(async () => {
  await handleGetFormularios();
});

const {
  dialogControl,
  dialogMode,
  dialogItem,
  setCreateDialog,
  setDeleteDialog,
} = useDialog<Formulario>();

const formularioDialogComponent = computed(() => {
  if (dialogMode.value == "create") {
    return CreateDialog;
  } else {
    return DeleteDialog;
  }
});
</script>

<template>
  <component
    :is="formularioDialogComponent"
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
        <h2>Formularios</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="success" @click="setCreateDialog()"> Agregar </v-btn>
        <DataTable :items="items" :headers="headers" :loading="isLoading">
          <template #[`item.hFechaCreacion`]="{ item }">
            {{ item.fechaCreacion.toDate().toLocaleDateString("es-MX") }}
          </template>

          <template #[`item.hNombre`]="{ item }">
            {{ item.nombre }}
          </template>

          <template #[`item.hPreguntas`]="{ item }">
            {{ item.preguntas.length }}
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
