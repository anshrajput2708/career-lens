import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import CareerBro from "@/components/CareerBro";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "CareerLens — Find Your Fastest Path to a New Career",
  description:
    "CareerLens finds the fastest path from who you already are to who you want to become — with a fit score, a roadmap, and zero wasted time.",
  keywords: ["career change", "career transition", "fit score", "career roadmap", "skill gap analysis"],
  openGraph: {
    title: "CareerLens — Find Your Fastest Path to a New Career",
    description:
      "Get your career fit score. See exactly how close you are to your dream role and the fastest path to get there.",
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
      <body style={{ paddingTop: "98px" }}>
        <SmoothScroll>
          <ConditionalNavbar />
          {children}
          <CareerBro />
        </SmoothScroll>
      </body>
    </html>
  );
}
