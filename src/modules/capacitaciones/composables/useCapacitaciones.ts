import {
  collection,
  getDocs,
  getDoc,
  writeBatch,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/plugins/firebase";

import { type Formulario } from "@/modules/formularios/schemas";
import { type Capacitacion, type CapacitacionRaw } from "../schemas";

export function useCapacitaciones() {
  async function addCapacitacion(capacitacion: CapacitacionRaw) {
    try {
      const batch = writeBatch(db);
      const capacitacionRef = doc(collection(db, "capacitaciones"));

      const { participantes, formularioRef, ...capacitacionData } =
        capacitacion;

      const formularioDocRef = doc(db, "formularios", formularioRef);
      batch.set(capacitacionRef, {
        ...capacitacionData,
        formularioRef: formularioDocRef,
      });

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

      const capacitacionesQuery = query(
        capacitacionesRef,
        orderBy("fechaCapacitacion", "desc"),
      );

      const capacitacionesSnapshot = await getDocs(capacitacionesQuery);

      const capacitaciones = await Promise.all(
        capacitacionesSnapshot.docs.map(async (capacitacionSnapshot) => {
          const formularioSnapshot = await getDoc(
            capacitacionSnapshot.data().formularioRef,
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

          const { fechaCapacitacion, ...capacitacionData } =
            capacitacionSnapshot.data();

          return {
            id: capacitacionSnapshot.id,
            fechaCapacitacion: fechaCapacitacion.toDate(),
            ...capacitacionData,
            nombreFormulario,
            participantes,
          };
        }),
      );

      return capacitaciones as unknown as Capacitacion[];
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
