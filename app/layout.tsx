import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Client Onboarding | RazoRSharp Networks",
  description: "One System. One Flow. One Outcome. FREEDOM — RazoRSharp Networks Client Onboarding",
  openGraph: {
    title: "Client Onboarding | RazoRSharp Networks",
    description: "TimeBACK System — 3-Stage Client Onboarding",
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
