import { collection, addDoc } from "firebase/firestore";
import { db } from "@/plugins/firebase";

export function useForms() {
  async function addForm(form: unknown) {
    const formsRef = collection(db, "formularios");
    const docRef = await addDoc(formsRef, form);
    return docRef.id;
  }

  return {
    addForm,
  };
}
