"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { answersBasePath, findNavPath, navHref } from "@/lib/navigation";

export function PortalBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname
    .replace(answersBasePath, "")
    .split("/")
    .filter(Boolean);
  const chain = findNavPath(segments);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {chain?.length ? (
            <BreadcrumbLink asChild>
              <Link href={answersBasePath}>Вопросы-ответы</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Вопросы-ответы</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {chain?.map((node, i) => {
          const isLast = i === chain.length - 1;
          const href = navHref(segments.slice(0, i + 1));
          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{node.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{node.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
