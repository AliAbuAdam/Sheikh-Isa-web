"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  Compass,
  Flower2,
  Gamepad2,
  Globe,
  GraduationCap,
  Hand,
  HandHelping,
  Heart,
  HeartHandshake,
  MoonStar,
  Mountain,
  PawPrint,
  Plane,
  Scale,
  ScrollText,
  Shirt,
  Smile,
  Stethoscope,
  TriangleAlert,
  UserPlus,
  Users,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { answersMenu, navHref, type NavNode } from "@/lib/navigation";

const categoryIcons: Record<string, LucideIcon> = {
  veroubezhdenie: MoonStar,
  "dlya-prinyavshih-islam": UserPlus,
  fikh: Scale,
  manhadzh: Compass,
  "koran-i-tafsir": BookOpen,
  "hadisy-i-asary": ScrollText,
  "znaniya-i-prizyv": GraduationCap,
  hidzhra: Plane,
  "rodstvennye-svyazi": Users,
  "grehi-i-pokayanie": TriangleAlert,
  "adab-i-ahlyak": Smile,
  "duhovnoe-vospitanie": Heart,
  "ispytaniya-i-terpenie": Mountain,
  "dua-i-azkary": HandHelping,
  "brak-i-razvod": HeartHandshake,
  syostram: Flower2,
  vneshnost: Shirt,
  "torgovlya-i-finansy": Wallet,
  meditsina: Stethoscope,
  "eda-i-pityo": UtensilsCrossed,
  "pro-zhivotnyh": PawPrint,
  "klyatva-obet-obeschaniya": Hand,
  "sotsialnye-problemy": Globe,
  "dosug-i-razvlecheniya": Gamepad2,
  "raznye-fetvy": CircleHelp,
};

function SubTree({
  nodes,
  parentSegments,
  pathname,
}: {
  nodes: NavNode[];
  parentSegments: string[];
  pathname: string;
}) {
  return (
    <SidebarMenuSub>
      {nodes.map((node) => {
        const segments = [...parentSegments, node.slug];
        const href = navHref(segments);
        const isActive = pathname === href;
        const inPath = pathname.startsWith(`${href}/`) || isActive;

        if (node.children?.length) {
          return (
            <Collapsible
              key={node.slug}
              asChild
              defaultOpen={inPath}
              className="group/subcollapsible"
            >
              <SidebarMenuSubItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuSubButton className="cursor-pointer">
                    <span>{node.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-90" />
                  </SidebarMenuSubButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SubTree
                    nodes={node.children}
                    parentSegments={segments}
                    pathname={pathname}
                  />
                </CollapsibleContent>
              </SidebarMenuSubItem>
            </Collapsible>
          );
        }

        return (
          <SidebarMenuSubItem key={node.slug}>
            <SidebarMenuSubButton asChild isActive={isActive}>
              <Link href={href}>
                <span>{node.title}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      })}
    </SidebarMenuSub>
  );
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <MoonStar className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Шейх Иса</span>
                  <span className="truncate text-xs text-muted-foreground">
                    База ответов
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Меню ответов</SidebarGroupLabel>
          <SidebarMenu>
            {answersMenu.map((category) => {
              const segments = [category.slug];
              const href = navHref(segments);
              const isActive = pathname === href;
              const inPath = pathname.startsWith(`${href}/`) || isActive;
              const Icon = categoryIcons[category.slug] ?? CircleHelp;

              if (!category.children?.length) {
                return (
                  <SidebarMenuItem key={category.slug}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={category.title}
                    >
                      <Link href={href}>
                        <Icon />
                        <span>{category.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <Collapsible
                  key={category.slug}
                  asChild
                  defaultOpen={inPath}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={category.title}>
                        <Icon />
                        <span>{category.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SubTree
                        nodes={category.children}
                        parentSegments={segments}
                        pathname={pathname}
                      />
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
