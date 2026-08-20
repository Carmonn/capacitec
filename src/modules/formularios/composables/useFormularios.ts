import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "@/plugins/firebase";

import { type Formulario, type FormularioRaw } from "../schemas";

export function useFormularios() {
  async function addFormulario(formulario: FormularioRaw): Promise<string> {
    try {
      const formsRef = collection(db, "formularios");
      const docRef = await addDoc(formsRef, formulario);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  async function getFormularios(): Promise<Formulario[]> {
    try {
      const formulariosRef = collection(db, "formularios");

      const formulariosQuery = query(
        formulariosRef,
        orderBy("fechaCreacion", "desc"),
      );

      const querySnapshot = await getDocs(formulariosQuery);
      const formularios = querySnapshot.docs.map((doc) => {
        const { fechaCreacion, ...formularioData } = doc.data();
        return {
          id: doc.id,
          fechaCreacion: fechaCreacion.toDate(),
          ...formularioData,
        };
      });

      return formularios as Formulario[];
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw error;
    }
  }

  async function deleteFormulario(formularioId: string): Promise<string> {
    try {
      const formRef = doc(db, "formularios", formularioId);
      const inUse = await isFormularioInUse(formRef);
      if (inUse) {
        throw new Error("Formulario en uso, no puede ser eliminado.");
      }
      await deleteDoc(formRef);
      return formularioId;
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw error;
    }
  }

  async function isFormularioInUse(
    formularioRef: DocumentReference,
  ): Promise<boolean> {
    const capacitacionesRef = collection(db, "capacitaciones");

    const q = query(
      capacitacionesRef,
      where("formularioRef", "==", formularioRef),
    );

    const snapshot = await getDocs(q);

    return !snapshot.empty;
  }

  return {
    addFormulario,
    getFormularios,
    deleteFormulario,
  };
}
