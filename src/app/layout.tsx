import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "CivicAudit AI - Autonomous Multi-Agent Procurement Forensic Engine",
  description:
    "Autonomous Public Procurement Oversight & Real-Time LLM Multi-Agent Tribunal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased font-sans">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
