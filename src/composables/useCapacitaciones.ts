import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  writeBatch,
  doc,
} from "firebase/firestore";
import { z } from "zod";
import { db } from "@/plugins/firebase";

const respuestaSchema = z.object({
  calificacion: z.number(),
  preguntas: z.array(
    z.object({
      preguntaId: z.string(),
      respuestaId: z.string(),
    }),
  ),
});
const participanteSchema = z.object({
  id: z.string().optional(),
  nombre: z.string(),
  apellidoPaterno: z.string(),
  apellidoMaterno: z.string(),
  curp: z.string(),
  diagnostico: respuestaSchema.optional(),
  final: respuestaSchema.optional(),
});
export type Participante = z.infer<typeof participanteSchema>;

const capacitacionSchema = z.object({
  id: z.string().optional(),
  nombreInstructor: z.string().nullable(),
  fechaRealizacion: z.string(),
  estado: z.string(),
  municipio: z.string().nullable(),
  cliente: z.string(),
  formularioId: z.string(),
  participantes: z.array(participanteSchema).optional(),
});
export type Capacitacion = z.infer<typeof capacitacionSchema>;

export function useCapacitaciones() {
  function validateCapacitacion(capacitacion: unknown) {
    const validation = capacitacionSchema.safeParse(capacitacion);

    if (validation.success) {
      return {
        isValid: true,
        data: validation.data,
        errors: [],
      };
    }

    return {
      isValid: false,
      data: null,
      errors: validation.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  async function addCapacitacion(capacitacion: Capacitacion) {
    const validation = validateCapacitacion(capacitacion);

    if (!validation.isValid) {
      console.error("Errores de validación:", validation.errors);
      throw new Error(
        `No cumple la estructura esperada: ${validation.errors.join(" | ")}`,
      );
    }

    const capacitacionesRef = collection(db, "capacitaciones");
    const capacitacionRef = await addDoc(capacitacionesRef, validation.data);

    if (capacitacion?.participantes) {
      const participantesRef = collection(
        db,
        "capacitaciones",
        capacitacionRef.id,
        "participantes",
      );

      for (const participante of capacitacion.participantes) {
        await addDoc(participantesRef, participante);
      }
    }
    return capacitacionRef.id;
  }

  async function getCapacitaciones() {
    const capacitacionesRef = collection(db, "capacitaciones");
    const querySnapshot = await getDocs(capacitacionesRef);

    const capacitaciones = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const participantesRef = collection(
          db,
          "capacitaciones",
          docSnapshot.id,
          "participantes",
        );

        const participantesSnapshot = await getDocs(participantesRef);

        const participantes = participantesSnapshot.docs.map(
          (participante) => ({
            id: participante.id,
            ...participante.data(),
          }),
        );

        return {
          id: docSnapshot.id,
          ...docSnapshot.data(),
          participantes,
        };
      }),
    );

    return capacitaciones as Capacitacion[];
  }

  async function deleteCapacitacion(capacitacionId: string) {
    const capacitacionRef = doc(db, "capacitaciones", capacitacionId);
    const participantesRef = collection(capacitacionRef, "participantes");
    const participantesSnapshot = await getDocs(participantesRef);
    const batch = writeBatch(db);

    // Eliminar participantes
    participantesSnapshot.docs.forEach((participante) => {
      batch.delete(participante.ref);
    });

    // Eliminar capacitación
    batch.delete(capacitacionRef);

    await batch.commit();
  }

  return {
    addCapacitacion,
    getCapacitaciones,
    deleteCapacitacion,
  };
}
