<script setup lang="ts">
import { ref } from "vue";

import {
  type Capacitacion,
  useCapacitaciones,
} from "../composables/useCapacitaciones";

const showDialogCreate = defineModel<boolean>();

const { addCapacitacion } = useCapacitaciones();
const nombreInstructor = ref("");

async function submit() {
  await handleAddCapacitacion();
}

async function handleAddCapacitacion() {
  try {
    const capacitacionId = await addCapacitacion({
      nombreInstructor: nombreInstructor.value,
      fechaRealizacion: new Date().toISOString(),
      estado: "Mexico",
      municipio: null,
      cliente: "BBVA",
      formularioId: "rMwhNMwWzCZ4uo0nbbYv",
      participantes: [
        {
          nombre: "Juan",
          apellidoPaterno: "Perez",
          apellidoMaterno: "Gomez",
          curp: "JUAP880101HDFRRL09",
        },
        {
          nombre: "Luis",
          apellidoPaterno: "Sanchez",
          apellidoMaterno: "Rosas",
          curp: "LSAR880101HDFRRL09",
        },
      ],
    });
    console.log("Capacitación agregada con ID:", capacitacionId);
  } catch (error) {
    console.error("Error al agregar la capacitación:", error);
  }
}
</script>

<template>
  <v-dialog v-model="showDialogCreate">
    <v-card>
      <v-card-title>
        <span class="text-h5"> Agregar capacitación </span>
      </v-card-title>

      <v-card-text>
        <div>
          <v-text-field
            v-model="nombreInstructor"
            label="Nombre del instructor"
            outlined
          ></v-text-field>
        </div>
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
