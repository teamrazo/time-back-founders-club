import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Client Intake Form | RazoRSharp Networks",
  description: "TimeBACK System — New Client Onboarding. One System. One Flow. One Outcome. FREEDOM.",
  openGraph: {
    title: "Client Intake Form | RazoRSharp Networks",
    description: "TimeBACK System onboarding — build your FREEDOM Plan.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-brand-navy antialiased">{children}</body>
    </html>
  );
}
