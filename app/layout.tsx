export const metadata = {
  title: "Auth Demo",
  description: "Google + Email/Password auth on Firebase, deployed to Vercel",
};

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
