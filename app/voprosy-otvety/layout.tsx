import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { PortalBreadcrumbs } from "@/components/portal-breadcrumbs";
import { PortalSidebarReopen } from "@/components/portal-sidebar-reopen";
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center gap-2 px-4">
            <PortalSidebarReopen />
            <PortalBreadcrumbs />
            <div className="ml-auto">
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
