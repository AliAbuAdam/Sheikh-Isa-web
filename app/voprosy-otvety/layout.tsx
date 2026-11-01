import { Search } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { PortalBreadcrumbs } from "@/components/portal-breadcrumbs";
import { PortalSidebarReopen } from "@/components/portal-sidebar-reopen";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Средняя колонка совпадает с колонкой контента (max-w-5xl). */}
        <header className="relative grid h-16 shrink-0 grid-cols-[minmax(auto,1fr)_minmax(0,64rem)_minmax(auto,1fr)] items-center border-b">
          <div className="flex items-center gap-2 pl-4 empty:pl-0">
            <PortalSidebarReopen />
          </div>
          <div className="pr-14 pl-2 sm:pr-16 sm:pl-6">
            <div className="relative w-full max-w-md min-w-0">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Поиск по ответам (скоро)"
                aria-label="Поиск по ответам"
                disabled
              />
            </div>
          </div>
          <div />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 sm:right-6">
            <ModeToggle />
          </div>
        </header>
        <div className="mx-auto w-full max-w-5xl px-4 pt-4 sm:px-6">
          <PortalBreadcrumbs />
        </div>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
