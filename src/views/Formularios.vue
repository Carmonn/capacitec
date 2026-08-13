<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import DataTable from "@/components/base/DataTable.vue";
import CreateFormDialog from "@/components/formulariosView/CreateFormDialog.vue";
import DeleteFormDialog from "@/components/formulariosView/DeleteFormDialog.vue";

import { type Form, useForms } from "@/composables/useForms";

const { getForms } = useForms();
const headers = ref([
  { title: "Nombre del formulario", value: "hnombre" },
  { title: "Total de preguntas", value: "hpreguntas" },
  { title: "Acciones", value: "hactions", sortable: false },
]);
const items = ref<Form[]>([]);
async function handleGetForm() {
  try {
    const forms = await getForms();
    if (!forms) items.value = [];
    else items.value = forms;
    console.log("Formularios obtenidos:", forms);
  } catch (error) {
    console.error("Error al obtener los formularios:", error);
  }
}
onMounted(async () => {
  await handleGetForm();
});

const {
  formDialogControl,
  selectedForm,
  formDialogComponent,
  openAddDialog,
  openDeleteDialog,
} = useFormDialog();

function useFormDialog() {
  const formDialogMode = ref<"create" | "delete">("create");
  const formDialogControl = ref(false);
  const selectedForm = ref<Form | null>(null);

  const formDialogComponent = computed(() => {
    if (formDialogMode.value === "create") {
      return CreateFormDialog;
    }
    return DeleteFormDialog;
  });

  function openAddDialog() {
    selectedForm.value = null;
    formDialogMode.value = "create";
    formDialogControl.value = true;
  }
  function openDeleteDialog(form: Form | null) {
    selectedForm.value = form;
    formDialogMode.value = "delete";
    formDialogControl.value = true;
  }

  return {
    formDialogControl,
    selectedForm,
    formDialogComponent,
    openAddDialog,
    openDeleteDialog,
  };
}
</script>

<template>
  <component
    :is="formDialogComponent"
    v-model="formDialogControl"
    :item="selectedForm"
  ></component>

  <v-container>
    <v-row>
      <v-col>
        <h2>Formularios</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="success" @click="openAddDialog()"> Agregar </v-btn>
        <DataTable :items="items" :headers="headers">
          <template #[`item.hnombre`]="{ item }">
            {{ item.nombre }}
          </template>

          <template #[`item.hpreguntas`]="{ item }">
            {{ item.preguntas.length }}
          </template>

          <template #[`item.hactions`]="{ item }">
            <v-btn color="error" @click="openDeleteDialog(item)">
              Eliminar
            </v-btn>
          </template>
        </DataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
