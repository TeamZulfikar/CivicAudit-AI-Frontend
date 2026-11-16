import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" suppressHydrationWarning className={cn("h-full antialiased font-sans", "font-sans", inter.variable)}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <NextTopLoader
          color="#19c7e8"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 12px #19c7e8,0 0 5px #19c7e8"
          zIndex={99999}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
