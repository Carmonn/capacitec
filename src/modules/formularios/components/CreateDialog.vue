<script setup lang="ts">
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

import { useForm } from "vee-validate";
import { useStatus } from "@/composables/useStatus";
import { useFormularios } from "../composables/useFormularios";

const { addFormulario } = useFormularios();
const { isLoading, status } = useStatus();
const {
  nombreFormulario,
  selectedFile,
  errors,
  handleSubmit,
  nombreFormularioAttrs,
  selectedFileAttrs,
} = useDefineForm();

const emit = defineEmits<{
  created: [id: string];
}>();

const showDialogCreate = defineModel<boolean>();
const submit = handleSubmit(async (values) => {
  if (!values.selectedFile) {
    return;
  }
  try {
    status.value = "loading";
    const text = await values.selectedFile.text();
    const formulario = JSON.parse(text);
    const formularioId = await addFormulario({
      nombre: values.nombreFormulario,
      ...formulario,
    });

    status.value = "success";
    emit("created", formularioId);
  } catch (error) {
    console.error("Error al agregar el formulario:", error);
    status.value = "error";
  }
});

function useDefineForm() {
  type FormValues = {
    nombreFormulario: string;
    selectedFile: File | null;
  };
  const schema = z.object({
    nombreFormulario: z
      .string()
      .nonempty("El nombre del formulario es obligatorio"),
    selectedFile: z
      .instanceof(File, {
        message: "Debes seleccionar un archivo",
      })
      .refine((file) => file.name.endsWith(".json"), {
        message: "El archivo debe ser un JSON",
      }),
  });

  const validateOnModelUpdate = (state: any) => ({
    validateOnModelUpdate: state.errors.length > 0,
  });
  const { errors, defineField, handleSubmit } = useForm<FormValues>({
    validationSchema: toTypedSchema(schema),
  });
  const [nombreFormulario, nombreFormularioAttrs] = defineField(
    "nombreFormulario",
    validateOnModelUpdate,
  );
  const [selectedFile, selectedFileAttrs] = defineField(
    "selectedFile",
    validateOnModelUpdate,
  );

  return {
    nombreFormulario,
    nombreFormularioAttrs,
    selectedFile,
    selectedFileAttrs,
    errors,
    handleSubmit,
  };
}
</script>

<template>
  <v-dialog v-model="showDialogCreate" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3"> mdi-file-document-plus-outline </v-icon>
        <span>Agregar formulario</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="showDialogCreate = false"
        />
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field
            v-model="nombreFormulario"
            v-bind="nombreFormularioAttrs"
            :error-messages="errors.nombreFormulario"
            label="Nombre del formulario"
            placeholder="Ej. Brigadistas 2026"
            variant="outlined"
            prepend-inner-icon="mdi-format-title"
            class="mb-4"
          />

          <v-file-input
            v-model="selectedFile"
            v-bind="selectedFileAttrs"
            :error-messages="errors.selectedFile"
            label="Archivo del formulario"
            placeholder="Selecciona un archivo JSON"
            accept=".json,application/json"
            variant="outlined"
            prepend-inner-icon="mdi-file-code-outline"
            show-size
            hint="Selecciona el archivo JSON que contiene las preguntas"
            persistent-hint
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn variant="text" @click="showDialogCreate = false">
          Cancelar
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          :disabled="isLoading"
          :loading="isLoading"
          @click="submit"
        >
          Agregar formulario
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
