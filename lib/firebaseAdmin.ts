import { getApps } from "firebase-admin/app";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getPrivateKey() {
  const pk = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!pk) return undefined;
  // Support escaped newlines
  return pk.replace(/\\n/g, "\n");
}

export function getAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  // You can use either a full service account JSON or split vars
  const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const credentials = JSON.parse(serviceAccountJson);
    return initializeApp({
      credential: cert(credentials as any),
      projectId: credentials.project_id,
    });
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      } as any),
      projectId,
    });
  }

  // Fallback (works on Google-hosted environments)
  return initializeApp({ credential: applicationDefault() });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
