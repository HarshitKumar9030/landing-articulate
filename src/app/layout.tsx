import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Configure the font with Next.js font optimization
const inter = JetBrains_Mono({ 
  subsets: ["latin"],
  display: "swap", // Ensures text remains visible while font loads
  variable: "--font-inter", // Exposes font as a CSS variable
});

export const metadata: Metadata = { 
  title: "ArticulateX", 
  description: "A modern public speaking studio tailored for professionals.",
};

export default function RootLayout({ 
  children 
}: Readonly<{ 
  children: React.ReactNode 
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", inter.variable, inter.className, "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="antialiased text-gray-900 bg-white transition-colors dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
