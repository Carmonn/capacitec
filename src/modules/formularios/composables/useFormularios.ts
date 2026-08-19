import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/plugins/firebase";

import { type Formulario, type FormularioCreate } from "../schemas";

export function useFormularios() {
  async function addFormulario(formulario: FormularioCreate): Promise<string> {
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
      const formsRef = collection(db, "formularios");
      const querySnapshot = await getDocs(formsRef);
      const formularios = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return formularios as Formulario[];
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw error;
    }
  }

  async function deleteFormulario(formularioId: string): Promise<string> {
    try {
      const formRef = doc(db, "formularios", formularioId);
      await deleteDoc(formRef);
      return formularioId;
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw error;
    }
  }

  return {
    addFormulario,
    getFormularios,
    deleteFormulario,
  };
}
