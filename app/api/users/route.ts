import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../lib/firebaseAdmin";

function parseAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing Authorization: Bearer <ID_TOKEN>" }, { status: 401 });
    }
    const idToken = authHeader.slice(7);
    const decoded = await adminAuth().verifyIdToken(idToken);
    const email = (decoded.email || "").toLowerCase();
    const allowed = parseAdminEmails();
    if (!email || !allowed.includes(email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snap = await adminDb().collection("users").orderBy("lastLoginAt", "desc").limit(500).get();
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}
