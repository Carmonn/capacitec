<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

import { useForm } from "vee-validate";
import { useStatus } from "@/composables/useStatus";
import { useCapacitaciones } from "../composables/useCapacitaciones";

const { addCapacitacion } = useCapacitaciones();
const { isLoading, status, resetStatus } = useStatus();
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

const emit = defineEmits<{
  created: [id: string];
}>();

const showDialogCreate = defineModel<boolean>();
const submit = handleSubmit(async (values) => {
  try {
    const capacitacionId = await addCapacitacion({
      fechaCapacitacion: values.fechaCapacitacion.toISOString(),
      cliente: values.cliente,
      formularioRef: values.formularioRef,
    });
    console.log("Capacitación agregada con ID:", capacitacionId);
  } catch (error) {
    console.error("Error al agregar la capacitación:", error);
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
      .refine((date) => date > new Date(), {
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
</script>

<template>
  <v-dialog v-model="showDialogCreate">
    <v-card>
      <v-card-title>
        <span class="text-h5"> Agregar capacitación </span>
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
            :items="[]"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDialogCreate = false"
          >Cancelar</v-btn
        >
        <v-btn color="primary" text @click="submit"> Agregar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
