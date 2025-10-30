"use client";

import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, getIdToken } from "firebase/auth";

type AdminUser = {
  id: string;
  uid?: string;
  email?: string;
  displayName?: string | null;
  provider?: string;
  photoURL?: string | null;
  emailVerified?: boolean;
  lastLoginAt?: any;
  createdAt?: any;
};

export default function AdminUsersTable() {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminUser[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setMe(u);
      if (!u) { setLoading(false); return; }
      try {
        const token = await getIdToken(u, true);
        const res = await fetch("/api/users", {
          headers: { Authorization: "Bearer " + token }
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || ("HTTP " + res.status));
        }
        const data = await res.json();
        setRows(data.users || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  if (!me) return <p className="muted">Please sign in with an admin email to view users.</p>;
  if (loading) return <p className="muted">Loading users…</p>;
  if (error) return <p className="muted" style={{ color: "#ff6166" }}>{error}</p>;

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #243042", padding: "8px" }}>Email</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #243042", padding: "8px" }}>Name</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #243042", padding: "8px" }}>Provider</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #243042", padding: "8px" }}>Verified</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #243042", padding: "8px" }}>Last login</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "8px" }}>{r.email}</td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "8px" }}>{r.displayName || "—"}</td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "8px" }}>{r.provider || "—"}</td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "8px" }}>{r.emailVerified ? "yes" : "no"}</td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "8px" }}>{r.lastLoginAt?.toDate ? r.lastLoginAt.toDate().toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
