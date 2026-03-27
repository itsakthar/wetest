import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "SiteIQ — AI Website Analyzer",
  description:
    "Deep AI analysis of any website: UI/UX, Performance, SEO, Accessibility, Security, and more. Get actionable improvement suggestions instantly.",
  keywords: ["website analyzer", "SEO audit", "UI UX analysis", "web performance", "AI audit"],
  openGraph: {
    title: "SiteIQ — AI Website Analyzer",
    description: "Get AI-powered scores and improvement suggestions for any website in seconds.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
