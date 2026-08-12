import { collection, getDocs, addDoc } from "firebase/firestore";
import { z } from "zod";
import { db } from "@/plugins/firebase";

const formSchema = z.object({
  nombre: z.string(),
  preguntas: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      texto: z.string(),
      opciones: z.array(
        z.object({
          id: z.union([z.string(), z.number()]),
          texto: z.string(),
          correcta: z.boolean(),
        }),
      ),
    }),
  ),
});

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
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  return {
    addForm,
    getForms,
    validateFormJson,
  };
}
