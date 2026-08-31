import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import type { CSSProperties } from "react";
import { assetPath } from "@/src/lib/paths";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MM. Portfolio",
  description: "Creative developer and digital designer portfolio.",
};

const cursorStyles = {
  "--cursor-plane": `url("${assetPath("/assets/cursor-plane-yellow.svg")}") 5 4`,
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      style={cursorStyles}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
