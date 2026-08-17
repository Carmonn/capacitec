<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import DataTable from "@/components/base/DataTable.vue";
import CreateFormularioDialog from "@/components/formulariosView/CreateFormularioDialog.vue";
import DeleteFormularioDialog from "@/components/formulariosView/DeleteFormularioDialog.vue";

import { type Formulario, useFormularios } from "@/composables/useFormularios";
import { useDialog } from "@/composables/useDialog";

const { getFormularios } = useFormularios();
const headers = ref([
  { title: "Nombre del formulario", value: "hnombre" },
  { title: "Total de preguntas", value: "hpreguntas" },
  { title: "Acciones", value: "hactions", sortable: false },
]);
const items = ref<Formulario[]>([]);

async function handleGetFormularios() {
  try {
    const formularios = await getFormularios();
    if (!formularios) items.value = [];
    else items.value = formularios;
    console.log("Formularios obtenidos:", formularios);
  } catch (error) {
    console.error("Error al obtener los formularios:", error);
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
    return CreateFormularioDialog;
  } else {
    return DeleteFormularioDialog;
  }
});
</script>

<template>
  <component
    :is="formularioDialogComponent"
    v-model="dialogControl"
    :item="dialogItem"
  ></component>

  <v-container>
    <v-row>
      <v-col>
        <h2>Formularios</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="success" @click="setCreateDialog()"> Agregar </v-btn>
        <DataTable :items="items" :headers="headers">
          <template #[`item.hnombre`]="{ item }">
            {{ item.nombre }}
          </template>

          <template #[`item.hpreguntas`]="{ item }">
            {{ item.preguntas.length }}
          </template>

          <template #[`item.hactions`]="{ item }">
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
