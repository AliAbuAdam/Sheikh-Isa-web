"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { answersMenu, navHref, type NavNode } from "@/lib/navigation";

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

export function AnswersTreeMenu() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {answersMenu.map((category) => {
        const segments = [category.slug];
        const href = navHref(segments);
        const isActive = pathname === href;
        const inPath = pathname.startsWith(`${href}/`) || isActive;

        if (!category.children?.length) {
          return (
            <SidebarMenuItem key={category.slug}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={category.title}
              >
                <Link href={href}>
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
  );
}
