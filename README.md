# Vercel + Firebase Auth App

**Features**
- Sign up / log in with **Google** or **email + password** (Firebase Authentication).
- On login, user's email shows **red** if they used Google, **blue** if they used email+password.
- Every successful auth upserts a user document into **Cloud Firestore** (`/users/{uid}`) with provider and timestamps.
- Designed for **Vercel** deployment with **env variables**.

## 1) Firebase setup
1. Create a Firebase project at https://console.firebase.google.com
2. Go to **Build → Authentication → Sign-in method** and enable:
   - **Google**
   - **Email/Password**
3. Go to **Project settings → General → Your apps → Web app** and copy the config values.
4. Go to **Build → Firestore** and create a database (Start in production).
5. (Optional but recommended) Set the Firestore rules (see `firestore.rules`).

> Important: Under **Authentication → Settings → Authorized domains** add your Vercel domain
> (e.g. `your-project.vercel.app`) so Google sign-in works in production.

## 2) Configure environment variables
Copy `.env.local.example` to `.env.local` and fill in your Firebase config. These should be set as **Environment Variables** in Vercel too.

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 3) Run locally
```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 4) Deploy to Vercel
- Push this project to GitHub/GitLab/Bitbucket.
- In Vercel, **Import Project** and connect the repo.
- Add the environment variables above in **Project Settings → Environment Variables** (for Production and Preview).
- Deploy. You're done 🚀

## Notes
- The Firebase web API key is not a server secret, but it's still best practice to keep it in env vars.
- The app uses localStorage to remember **how you last logged in** and color the email accordingly.
- User document fields written on sign-in: `uid`, `email`, `displayName`, `provider`, `photoURL`, `emailVerified`, `lastLoginAt`, `createdAt`.
