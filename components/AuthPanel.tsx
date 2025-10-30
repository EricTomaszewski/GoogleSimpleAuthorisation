"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { upsertUser } from "../lib/upsertUser";

type Mode = "login" | "signup";

export default function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session and last used provider (purely for UI color)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (typeof window !== "undefined") {
        const lp = window.localStorage.getItem("lastProvider");
        if (lp) setLastProvider(lp);
        else if (u?.providerData?.length) setLastProvider(u.providerData[0]?.providerId || null);
      }
    });
    return () => unsub();
  }, []);

  const color = useMemo(() => {
    if (!lastProvider) return "#e6edf3";
    if (lastProvider === GoogleAuthProvider.PROVIDER_ID || lastProvider === "google.com") return "red";
    if (lastProvider === "password") return "blue";
    return "#e6edf3";
  }, [lastProvider]);

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const provider = cred.providerId || "google.com";
      if (typeof window !== "undefined") window.localStorage.setItem("lastProvider", provider);
      await upsertUser(cred.user, provider);
      setLastProvider(provider);
    } catch (e: any) {
      setError(e?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailAuth() {
    setError(null);
    setLoading(true);
    try {
      const provider = "password";
      let cred;
      if (mode === "signup") {
        cred = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        cred = await signInWithEmailAndPassword(auth, email, password);
      }
      if (typeof window !== "undefined") window.localStorage.setItem("lastProvider", provider);
      await upsertUser(cred.user, provider);
      setLastProvider(provider);
      setEmail("");
      setPassword("");
    } catch (e: any) {
      setError(e?.message || "Email/password auth failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setError(null);
    setLoading(true);
    try {
      await signOut(auth);
      setLastProvider(null);
    } catch (e: any) {
      setError(e?.message || "Sign out failed");
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span className="badge">Logged in via {lastProvider === "password" ? "email+password" : "Google"}</span>
        </div>
        <p style={{ fontSize: "1.1rem", margin: "8px 0" }}>
          Hello,&nbsp;
          <strong style={{ color }}>{user.email}</strong>
        </p>
        <div className="row">
          <button disabled={loading} onClick={handleLogout}>Sign out</button>
        </div>
        <p className="muted" style={{ marginTop: 12 }}>
          Your profile is written to Firestore on every sign-in with fields: <code>uid</code>, <code>email</code>, <code>displayName</code>, <code>provider</code>, <code>lastLoginAt</code>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button onClick={() => setMode("login")} disabled={mode === "login"}>Login</button>
        <button onClick={() => setMode("signup")} disabled={mode === "signup"}>Sign up</button>
      </div>

      <label>Email</label>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password</label>
      <input
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="row">
        <button onClick={handleEmailAuth} disabled={loading || !email || !password}>
          {mode === "signup" ? "Create account" : "Login"}
        </button>
        <button onClick={handleGoogle} disabled={loading}>
          Continue with Google
        </button>
      </div>
      {error && <p className="muted" style={{ color: "#ff6166", marginTop: 8 }}>{error}</p>}
      <p className="muted" style={{ marginTop: 12 }}>
        Tip: email shows <strong style={{ color: "red" }}>red</strong> if you used Google, and <strong style={{ color: "blue" }}>blue</strong> if you used email + password.
      </p>
    </div>
  );
}
