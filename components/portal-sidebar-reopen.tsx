"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

// Основной значок живёт в сайдбаре, поэтому в шапке он нужен,
// только когда сайдбар скрыт: иначе его нечем открыть.
export function PortalSidebarReopen() {
  const { isMobile, state } = useSidebar();
  if (!isMobile && state === "expanded") return null;

  return (
    <>
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="data-vertical:h-4 data-vertical:self-auto"
      />
    </>
  );
}
