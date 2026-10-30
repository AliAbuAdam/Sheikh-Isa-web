"use client";

import * as React from "react";
import Link from "next/link";

import { AnswersBranchedMenu } from "@/components/answers-branched-menu";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex w-fit items-center px-2 py-1.5">
          <Logo className="h-10 w-auto shrink-0 text-foreground" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-3 pb-10">
        <SidebarGroup>
          <AnswersBranchedMenu />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
