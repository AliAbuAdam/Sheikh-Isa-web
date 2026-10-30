"use client";

import { usePathname } from "next/navigation";

import { BranchedMenu, type BranchedItem } from "@/components/branched-menu";
import { SidebarGroupLabel, SidebarTrigger } from "@/components/ui/sidebar";
import { answersMenu, navHref, type NavNode } from "@/lib/navigation";

function toBranchedItems(nodes: NavNode[], parent: string[]): BranchedItem[] {
  return nodes.map((node) => {
    const segments = [...parent, node.slug];
    return {
      label: node.title,
      href: navHref(segments),
      children: node.children && toBranchedItems(node.children, segments),
    };
  });
}

const items = toBranchedItems(answersMenu, []);

export function AnswersBranchedMenu() {
  return (
    <BranchedMenu
      items={items}
      pathname={usePathname()}
      label="Меню ответов"
      heading={<SidebarGroupLabel>Меню ответов</SidebarGroupLabel>}
      toolbarStart={<SidebarTrigger className="branched-menu__tool size-8" />}
    />
  );
}
