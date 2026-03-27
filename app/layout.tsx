import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ci.razorsharpnetworks.com"),
  title: "TimeBACK Founders Club | RazoRSharp Networks",
  description:
    "Your AI Growth Engineer for $9. Get a $20 AI wallet and experience what 24/7 growth engineering feels like. Meet CATO — systems that run your business while you sleep.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TimeBACK Founders Club — Your Business Should Run Without You",
    description:
      "Meet CATO, your AI Growth Engineer. For $9, get a $20 AI wallet and experience 24/7 growth engineering. Daily coaching, CRM automation, and growth execution.",
    type: "website",
    url: "https://ci.razorsharpnetworks.com",
    siteName: "RazoRSharp Networks",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TimeBACK Founders Club — AI Growth Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TimeBACK Founders Club — Your Business Should Run Without You",
    description:
      "Meet CATO, your AI Growth Engineer. $9 gets you a $20 AI wallet + 24/7 growth execution.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://ci.razorsharpnetworks.com",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "RazoRSharp Networks",
                url: "https://razorsharpnetworks.com",
                logo: "https://ci.razorsharpnetworks.com/rs-icon.png",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "TimeBACK Founders Club",
                url: "https://ci.razorsharpnetworks.com",
              },
              {
                "@context": "https://schema.org",
                "@type": "Product",
                name: "TimeBACK Founders Club",
                description:
                  "Your AI Growth Engineer. Get a $20 AI wallet and experience 24/7 growth engineering with CATO.",
                brand: {
                  "@type": "Brand",
                  name: "RazoRSharp Networks",
                },
                offers: {
                  "@type": "Offer",
                  price: "9.00",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: "https://ci.razorsharpnetworks.com",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What happens after I pay $9?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Your $20 AI wallet activates immediately. We create a private Slack channel and deploy CATO — your AI Growth Engineer. CATO starts working within 24 hours of profile completion.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What if I don't use it?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "You won't be billed again. Your wallet only depletes when CATO actively works on your behalf. No activity, no charges. If it doesn't deliver massive value, it costs you nothing beyond the $9.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How does billing work after the $20?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Usage-based. CATO tracks what it does for your business. When your wallet reaches your set threshold, it auto-refills. You control the amount. Cancel anytime through Slack.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What does CATO actually do?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Daily coaching briefs, system audits, CRM automation, growth strategy execution, follow-up management, workflow optimization — 24/7. Think of it as a growth engineer that never sleeps.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is this a subscription?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No fixed monthly fee. It's metered — you only pay for the work CATO does. Most clients find the ROI within the first week.",
                    },
                  },
                ],
              },
            ]),
          }}
        />
      </head>
      <body className={`min-h-screen bg-brand-bg antialiased ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
