"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";
import BadgeNotification from "@/components/ui/BadgeNotification";

export default function GameProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { visitPage, newBadges, dismissBadges } = useGameProgress();

  useEffect(() => {
    if (pathname) visitPage(pathname);
  }, [pathname, visitPage]);

  return (
    <>
      {children}
      <BadgeNotification badges={newBadges} onDismiss={dismissBadges} />
    </>
  );
}
