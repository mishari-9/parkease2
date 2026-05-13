import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { DesktopNav } from "@/components/DesktopNav";
import { LocaleHtml } from "@/components/LocaleHtml";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ParkEase — Qassim University (College of Computer)",
  description:
    "Find parking availability, pricing, and reserve a slot around the College of Computer at Qassim University, Buraydah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-[var(--background)] font-sans antialiased text-[var(--foreground)] transition-colors duration-300`}
      >
        <ThemeProvider>
          <LocaleHtml>
            <DesktopNav />
            <div className="relative min-h-screen lg:ps-64">
              {children}
              <BottomNav />
            </div>
          </LocaleHtml>
        </ThemeProvider>
      </body>
    </html>
  );
}
