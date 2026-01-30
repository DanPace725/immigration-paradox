import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Immigration Reality Check",
  description:
    "Interactive tools exploring common assumptions about U.S. immigration. Test your knowledge on legal status, compliance, and crime statistics.",
  keywords: [
    "immigration",
    "visa",
    "legal status",
    "policy",
    "deportation",
    "crime statistics",
    "H-1B",
    "asylum",
  ],
  openGraph: {
    title: "Immigration Reality Check",
    description:
      "Test your assumptions about U.S. immigration against facts and research.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
