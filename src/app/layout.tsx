import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrollProvider } from "@/components/scroll-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = new URL("https://articulatex.in");
const siteTitle = "ArticulateX";
const siteDescription = "ArticulateX is a communication studio for leaders, founders, and teams who want their message to land with clarity and presence.";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "ArticulateX",
  title: { default: siteTitle, template: "%s | ArticulateX" },
  description: siteDescription,
  keywords: ["public speaking coaching", "executive presence", "communication training", "founder pitch coaching", "leadership communication", "Mumbai"],
  authors: [{ name: "ArticulateX" }],
  creator: "ArticulateX",
  publisher: "ArticulateX",
  alternates: { canonical: "/" },
  category: "Professional development",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: {
    icon: [{ url: "/icons/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/icons/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: { type: "website", locale: "en_IN", url: "/", siteName: "ArticulateX", title: siteTitle, description: siteDescription },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://articulatex.in/#organization", name: "ArticulateX", url: "https://articulatex.in", logo: "https://articulatex.in/icons/icon.svg", email: "hello@articulatex.in", description: siteDescription },
      { "@type": "WebSite", "@id": "https://articulatex.in/#website", url: "https://articulatex.in", name: "ArticulateX", publisher: { "@id": "https://articulatex.in/#organization" }, inLanguage: "en-IN" },
    ],
  };

  return (
    <html lang="en" className={cn(mono.variable, mono.className, "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <ThemeProvider>
          <SmoothScrollProvider>
            <CustomCursor />
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
