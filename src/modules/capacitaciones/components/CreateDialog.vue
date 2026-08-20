<script setup lang="ts">
import { onMounted, ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

import { type Formulario } from "@/modules/formularios/schemas";

import { useForm } from "vee-validate";
import { useStatus } from "@/composables/useStatus";
import { useCapacitaciones } from "../composables/useCapacitaciones";
import { useFormularios } from "@/modules/formularios/composables/useFormularios";

const { getFormularios } = useFormularios();
const { addCapacitacion } = useCapacitaciones();
const { isLoading, isSuccess, status, resetStatus } = useStatus();
const {
  errors,
  handleSubmit,
  resetForm,
  fechaCapacitacion,
  fechaCapacitacionAttrs,
  cliente,
  clienteAttrs,
  formularioRef,
  formularioRefAttrs,
} = useDefineForm();
const { formularios, isFormulariosLoading } = useFormulariosList();

const emit = defineEmits<{
  created: [id: string];
}>();

const showDialogCreate = defineModel<boolean>();
const closeDialog = () => {
  showDialogCreate.value = false;
};
const submit = handleSubmit(async (values) => {
  try {
    status.value = "loading";
    const capacitacionId = await addCapacitacion({
      fechaCapacitacion: values.fechaCapacitacion,
      cliente: values.cliente,
      formularioRef: values.formularioRef,
    });
    status.value = "success";
    emit("created", capacitacionId);
    resetStatus();
    resetForm();
  } catch (error) {
    console.error("Error al agregar la capacitación:", error);
    status.value = "error";
  }
});

function useDefineForm() {
  const schema = z.object({
    fechaCapacitacion: z
      .date({
        required_error: "La fecha de capacitación es obligatoria",
        invalid_type_error:
          "La fecha de capacitación debe ser una fecha válida",
      })
      .refine((date) => date >= new Date(), {
        message: "La fecha de capacitación no puede ser antes de hoy",
      }),
    cliente: z.string().nonempty("El cliente es obligatorio"),
    formularioRef: z.string().nonempty("El formulario es obligatorio"),
  });

  const validateOnModelUpdate = (state: any) => ({
    validateOnModelUpdate: state.errors.length > 0,
  });
  const { errors, defineField, handleSubmit, resetForm } = useForm({
    validationSchema: toTypedSchema(schema),
  });
  const [fechaCapacitacion, fechaCapacitacionAttrs] = defineField(
    "fechaCapacitacion",
    validateOnModelUpdate,
  );
  const [cliente, clienteAttrs] = defineField("cliente", validateOnModelUpdate);
  const [formularioRef, formularioRefAttrs] = defineField(
    "formularioRef",
    validateOnModelUpdate,
  );

  return {
    fechaCapacitacion,
    fechaCapacitacionAttrs,
    cliente,
    clienteAttrs,
    formularioRef,
    formularioRefAttrs,
    errors,
    resetForm,
    handleSubmit,
  };
}

function useFormulariosList() {
  const { isLoading: isFormulariosLoading, status: formulariosStatus } =
    useStatus();

  const formularios = ref<{ title: string; value: string }[]>([]);
  async function handleGetFormularios() {
    try {
      formulariosStatus.value = "loading";
      const response = await getFormularios();
      formularios.value = response.map((formulario) => {
        return {
          title:
            formulario.fechaCreacion.toLocaleDateString("es-MX") +
            " - " +
            formulario.nombre,
          value: formulario.id,
        };
      });
      formulariosStatus.value = "success";
    } catch (error) {
      console.error("Error al obtener los formularios:", error);
      formulariosStatus.value = "error";
    }
  }
  onMounted(async () => {
    await handleGetFormularios();
  });

  return {
    formularios,
    isFormulariosLoading,
  };
}
</script>

<template>
  <v-dialog v-model="showDialogCreate" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3"> mdi-file-document-plus-outline </v-icon>
        <span>Agregar capacitación</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-date-input
            v-model="fechaCapacitacion"
            v-bind="fechaCapacitacionAttrs"
            :error-messages="errors.fechaCapacitacion"
            label="Fecha de capacitación"
            placeholder="Selecciona una fecha"
            variant="outlined"
            prepend-inner-icon="mdi-calendar-outline"
            prepend-icon=""
            class="mb-4"
          />

          <v-text-field
            v-model="cliente"
            v-bind="clienteAttrs"
            :error-messages="errors.cliente"
            label="Cliente"
            placeholder="Nombre del cliente"
            variant="outlined"
            prepend-inner-icon="mdi-domain"
            class="mb-4"
          />

          <v-select
            v-model="formularioRef as null | undefined"
            v-bind="formularioRefAttrs"
            :error-messages="errors.formularioRef"
            label="Formulario"
            placeholder="Selecciona un formulario"
            variant="outlined"
            prepend-inner-icon="mdi-file-document-outline"
            :items="formularios"
            :loading="isFormulariosLoading"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="primary" text @click="closeDialog">Cancelar</v-btn>
        <v-btn
          color="primary"
          text
          :disabled="isLoading || isSuccess"
          :loading="isLoading"
          @click="submit"
        >
          Agregar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
