"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";
import BadgeNotification from "@/components/ui/BadgeNotification";
import PrerequisiteBanner from "@/components/ui/PrerequisiteBanner";
import RelatedContent from "@/components/ui/RelatedContent";

export default function GameProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { visitPage, newBadges, dismissBadges } = useGameProgress();

  useEffect(() => {
    if (pathname) visitPage(pathname);
  }, [pathname, visitPage]);

  return (
    <>
      <PrerequisiteBanner />
      {children}
      <RelatedContent />
      <BadgeNotification badges={newBadges} onDismiss={dismissBadges} />
    </>
  );
}
