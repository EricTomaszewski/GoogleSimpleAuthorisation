import AdminUsersTable from "../../../components/AdminUsersTable";

export const metadata = {
  title: "Users Admin",
};

export default function UsersAdminPage() {
  return (
    <main>
      <div className="card">
        <h1>Users (Admin)</h1>
        <p className="muted">Only emails in <code>ADMIN_EMAILS</code> can view this. You must be signed in.</p>
        <div className="sep" />
        <AdminUsersTable />
      </div>
    </main>
  );
}
