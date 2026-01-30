import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Immigration Paradox | Status vs. Compliance",
  description:
    "An interactive tool exploring the gap between legal status and rule compliance in U.S. immigration. Factual scenarios with policy implications.",
  keywords: [
    "immigration",
    "visa",
    "legal status",
    "policy",
    "deportation",
    "H-1B",
    "asylum",
  ],
  openGraph: {
    title: "Immigration Paradox",
    description:
      "Explore the gap between 'being legal' and 'following the rules' in U.S. immigration.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
