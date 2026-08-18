import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/plugins/firebase";

export function useAuth() {
  const login = async (
    email: string,
    password: string,
  ): Promise<UserCredential> => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential;
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  const subscribe = (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, callback);

  return { login, logout, subscribe };
}
