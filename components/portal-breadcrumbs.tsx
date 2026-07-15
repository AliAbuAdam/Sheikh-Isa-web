"use client";

import * as React from "react";
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
        <BreadcrumbItem className="hidden md:block">
          {chain?.length ? (
            <BreadcrumbLink href={answersBasePath}>
              Вопросы-ответы
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
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{node.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{node.title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
