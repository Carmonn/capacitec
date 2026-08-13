import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { z } from "zod";
import { db } from "@/plugins/firebase";

const formSchema = z.object({
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
const formSchemaWithId = formSchema.extend({
  id: z.string(),
});
export type Form = z.infer<typeof formSchemaWithId>;

export function useForms() {
  function validateFormJson(form: unknown) {
    const validation = formSchema.safeParse(form);

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

  async function addForm(form: unknown) {
    const validation = validateFormJson(form);

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

  async function getForms() {
    const formsRef = collection(db, "formularios");
    const querySnapshot = await getDocs(formsRef);

    const formularios = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return formularios as Form[];
  }

  async function deleteForm(formId: string) {
    const formRef = doc(db, "formularios", formId);
    await deleteDoc(formRef);
  }

  return {
    addForm,
    getForms,
    deleteForm,
  };
}
