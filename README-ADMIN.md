## 5) Optional: Admin "Users" page (separate branch)
This adds a secure admin page at `/admin/users` which lists documents from `Firestore: users`.

**How it works**
- Client obtains a Firebase **ID token** (after sign-in).
- Calls server route **`/api/users`**.
- Server verifies the token using **Firebase Admin SDK**.
- Server checks that the email is listed in `ADMIN_EMAILS` env (comma-separated).
- If authorized, server reads Firestore and returns a list of user docs.

**Extra env vars (set in Vercel)**

```
# Option A: single JSON
FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON=...  # paste your service account JSON

# Option B: split fields
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
# Who can access /admin/users
ADMIN_EMAILS=you@company.com,other@company.com
```

Once deployed, visit `/admin/users` signed in with an admin email.
