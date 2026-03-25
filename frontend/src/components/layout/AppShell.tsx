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
            {/* Search bar + Breadcrumb row */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
              <div style={{ flex: 1 }}>
                <Suspense>
                  <Breadcrumb />
                </Suspense>
              </div>
              <button
                onClick={() => document.dispatchEvent(new Event("open-search"))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  minWidth: "220px",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow = "0 0 0 2px var(--primary-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Buscar...</span>
                <kbd style={{
                  marginLeft: "auto",
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  padding: "0.125rem 0.375rem",
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.25rem",
                  color: "var(--text-secondary)",
                }}>⌘K</kbd>
              </button>
            </div>
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
