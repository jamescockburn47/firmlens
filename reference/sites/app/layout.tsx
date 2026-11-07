import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirmLens — law firms and AI",
  description: "Follow law firms' AI announcements. Read the source, see what changed, and keep the evidence.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
