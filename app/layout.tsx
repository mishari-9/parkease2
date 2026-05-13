import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { LocaleHtml } from "@/components/LocaleHtml";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ParkEase — Smart parking",
  description: "Find and reserve parking in Riyadh. HCI course demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-pe-surface font-sans antialiased`}>
        <LocaleHtml>
          <div className="mx-auto min-h-screen max-w-lg shadow-[0_0_80px_rgba(26,111,191,0.06)]">
            {children}
          </div>
          <BottomNav />
        </LocaleHtml>
      </body>
    </html>
  );
}
