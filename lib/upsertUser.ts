import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "firebase/auth";

export async function upsertUser(u: User, provider: string) {
  const ref = doc(db, "users", u.uid);
  await setDoc(
    ref,
    {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || null,
      provider,
      photoURL: u.photoURL || null,
      emailVerified: u.emailVerified,
      lastLoginAt: serverTimestamp(),
      createdAt: new Date(u.metadata.creationTime || Date.now()),
    },
    { merge: true }
  );
}
