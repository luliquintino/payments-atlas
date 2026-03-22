"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import RelatedSection from "@/components/ui/RelatedSection";
import TrailNavigation from "@/components/layout/TrailNavigation";
import SearchOverlay from "@/components/ui/SearchOverlay";
import GameProvider from "@/components/layout/GameProvider";
import BottomNav from "@/components/layout/BottomNav";
import InstallBanner from "@/components/layout/InstallBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { ToastProvider } from "@/components/ui/Toast";

const PUBLIC_ROUTES = ["/landing", "/auth"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = isPublicRoute(pathname);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  if (isPublic) {
    return (
      <ToastProvider>
        <main style={{
          minHeight: "100vh",
          width: "100%",
          background: "var(--background)",
          color: "var(--foreground)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <div style={{ width: "100%", maxWidth: "100%" }}>
            {children}
          </div>
        </main>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <InstallBanner />
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
      <BottomNav />
      <ScrollToTop />
    </ToastProvider>
  );
}
