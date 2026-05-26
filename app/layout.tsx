import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEON VAULT — 3D NFT Gallery",
  description: "A cyberpunk 3D walkthrough gallery for your NFTs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
