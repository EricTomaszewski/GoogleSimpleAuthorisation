import AuthPanel from "../components/AuthPanel";

export default function Page() {
  return (
    <main>
      <div className="card">
        <h1>Welcome 👋</h1>
        <p className="muted">Sign up or log in with Google or email + password. We'll write users to Firestore and color your email based on how you logged in.</p>
        <div className="sep" />
        <AuthPanel />
        <footer>Built for Vercel + Firebase</footer>
      </div>
    </main>
  );
}
