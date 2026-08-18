import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { z } from "zod";
import { db } from "@/plugins/firebase";

const formularioSchema = z.object({
  nombre: z.string(),
  preguntas: z.array(
    z.object({
      id: z.string(),
      texto: z.string(),
      opciones: z.array(
        z.object({
          id: z.string(),
          texto: z.string(),
          correcta: z.boolean(),
        }),
      ),
    }),
  ),
});
const formularioSchemaWithId = formularioSchema.extend({
  id: z.string(),
});
export type Formulario = z.infer<typeof formularioSchemaWithId>;

export function useFormularios() {
  function validateFormularioJson(form: unknown) {
    const validation = formularioSchema.safeParse(form);

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

  async function addFormulario(form: unknown) {
    const validation = validateFormularioJson(form);

    if (!validation.isValid) {
      console.error("Errores de validación:", validation.errors);
      throw new Error(
        `El JSON del formulario no cumple la estructura esperada: ${validation.errors.join(" | ")}`,
      );
    }

    const formsRef = collection(db, "formularios");
    const docRef = await addDoc(formsRef, validation.data);
    return docRef.id;
  }

  async function getFormularios() {
    const formsRef = collection(db, "formularios");
    const querySnapshot = await getDocs(formsRef);

    const formularios = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return formularios as Formulario[];
  }

  async function deleteFormulario(formId: string) {
    const formRef = doc(db, "formularios", formId);
    await deleteDoc(formRef);
  }

  return {
    addFormulario,
    getFormularios,
    deleteFormulario,
  };
}
