import {
  collection,
  getDocs,
  getDoc,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "@/plugins/firebase";

import { type Formulario } from "@/modules/formularios/schemas";
import { type Capacitacion, type CapacitacionRaw } from "../schemas";

export function useCapacitaciones() {
  async function addCapacitacion(capacitacion: CapacitacionRaw) {
    try {
      const batch = writeBatch(db);
      const capacitacionRef = doc(collection(db, "capacitaciones"));

      const { participantes, ...capacitacionData } = capacitacion;

      batch.set(capacitacionRef, capacitacionData);

      if (participantes && participantes.length > 0) {
        const participantesRef = collection(
          db,
          "capacitaciones",
          capacitacionRef.id,
          "participantes",
        );

        for (const participante of participantes) {
          const participanteRef = doc(participantesRef);
          batch.set(participanteRef, participante);
        }
      }

      await batch.commit();
      return capacitacionRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  async function getCapacitaciones(): Promise<Capacitacion[]> {
    try {
      const capacitacionesRef = collection(db, "capacitaciones");
      const capacitacionesSnapshot = await getDocs(capacitacionesRef);

      const capacitaciones = await Promise.all(
        capacitacionesSnapshot.docs.map(async (capacitacionSnapshot) => {
          const formularioSnapshot = await getDoc(
            capacitacionSnapshot.data().formulario,
          );
          const formularioData = formularioSnapshot.data() as Formulario;
          const nombreFormulario = formularioData.nombre;

          const participantesRef = collection(
            capacitacionSnapshot.ref,
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
            id: capacitacionSnapshot.id,
            ...capacitacionSnapshot.data(),
            nombreFormulario,
            participantes,
          };
        }),
      );

      return capacitaciones as Capacitacion[];
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw error;
    }
  }

  async function deleteCapacitacion(capacitacionId: string) {
    try {
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
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw error;
    }
  }

  return {
    addCapacitacion,
    getCapacitaciones,
    deleteCapacitacion,
  };
}
