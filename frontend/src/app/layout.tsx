import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import RelatedSection from "@/components/ui/RelatedSection";
import TrailNavigation from "@/components/layout/TrailNavigation";
import SearchOverlay from "@/components/ui/SearchOverlay";
import GameProvider from "@/components/layout/GameProvider";

export const metadata: Metadata = {
  title: "Payments Academy",
  description:
    "Sistema de conhecimento, motor de diagnóstico e simulador de arquitetura para sistemas de pagamento",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen">
        <Sidebar />
        <SearchOverlay />
        <main
          className="flex-1 overflow-auto"
          style={{ marginLeft: "var(--sidebar-width)" }}
        >
          <GameProvider>
            <div className="px-8 py-6 max-w-[1400px] mx-auto">
              <Suspense>
                <Breadcrumb />
              </Suspense>
              {children}
              <Suspense>
                <TrailNavigation />
              </Suspense>
              <Suspense>
                <RelatedSection />
              </Suspense>
            </div>
          </GameProvider>
        </main>
      </body>
    </html>
  );
}
