import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeBACK Founders Club | RazoRSharp Networks",
  description: "Your AI Growth Engineer for $9. Get a $20 wallet and experience 24/7 growth engineering. One System. One Flow. One Outcome. FREEDOM.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
      <body className="min-h-screen bg-brand-bg antialiased">{children}</body>
    </html>
  );
}
