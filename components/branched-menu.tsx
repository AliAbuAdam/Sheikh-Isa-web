"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, ChevronsDownUp, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import "./branched-menu.css";

export type BranchedItem = {
  label: string;
  href: string;
  children?: BranchedItem[];
};

type MenuState = {
  pathname: string;
  open: Set<string>;
  expand: (href: string) => void;
  toggle: (href: string) => void;
};

// Геометрия линий; ROW и HEAD совпадают с высотой строки в branched-menu.css.
const ROW = 32;
const HEAD = 36;
const MARKER = 16;
const INDENT = 32;
const TRUNK = 10;
const RADIUS = 10;
const END_GAP = 6;

function isInPath(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function openForPath(items: BranchedItem[], pathname: string): string[] {
  return items.flatMap((item) =>
    item.children?.length && isInPath(item.href, pathname)
      ? [item.href, ...openForPath(item.children, pathname)]
      : [],
  );
}

function allParents(items: BranchedItem[]): string[] {
  return items.flatMap((item) =>
    item.children?.length ? [item.href, ...allParents(item.children)] : [],
  );
}

function RowHead({
  item,
  linkClassName,
  menu,
}: {
  item: BranchedItem;
  linkClassName: string;
  menu: MenuState;
}) {
  const hasChildren = Boolean(item.children?.length);
  const isOpen = menu.open.has(item.href);
  const isActive = menu.pathname === item.href;

  return (
    <div className="branched-menu__row">
      <Link
        href={item.href}
        className={linkClassName}
        aria-current={isActive ? "page" : undefined}
        data-active={isActive ? "" : undefined}
        data-in-path={isInPath(item.href, menu.pathname) ? "" : undefined}
        onClick={hasChildren ? () => menu.expand(item.href) : undefined}
      >
        {item.label}
      </Link>
      {hasChildren ? (
        <button
          type="button"
          className="branched-menu__toggle"
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Свернуть" : "Раскрыть"}: ${item.label}`}
          data-open={isOpen ? "" : undefined}
          onClick={() => menu.toggle(item.href)}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function Body({ item, menu }: { item: BranchedItem; menu: MenuState }) {
  if (!item.children?.length) return null;
  const isOpen = menu.open.has(item.href);

  return (
    <div className="branched-menu__body" data-open={isOpen ? "" : undefined}>
      <div className="branched-menu__fold" inert={!isOpen}>
        <Tree nodes={item.children} menu={menu} />
      </div>
    </div>
  );
}

function Tree({ nodes, menu }: { nodes: BranchedItem[]; menu: MenuState }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [geometry, setGeometry] = useState<{
    height: number;
    rows: number[];
  } | null>(null);

  // Высота строк зависит от переноса и раскрытых веток, поэтому линии
  // строятся по реальным позициям и обновляются при каждом изменении размера.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(() => {
      setGeometry({
        height: list.offsetHeight,
        rows: Array.from(list.children, (row) => {
          return (row as HTMLElement).offsetTop + ROW / 2;
        }),
      });
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  const elbow = (y: number) =>
    `A ${RADIUS} ${RADIUS} 0 0 0 ${TRUNK + RADIUS} ${y} H ${INDENT - END_GAP}`;

  return (
    <div className="branched-menu__tree">
      {geometry ? (
        <svg
          className="branched-menu__lines"
          width={INDENT}
          height={geometry.height}
          aria-hidden="true"
        >
          <path
            className="branched-menu__base"
            d={`M ${TRUNK} 0 V ${geometry.rows[geometry.rows.length - 1] - RADIUS}`}
          />
          {geometry.rows.map((y, i) => (
            <path
              key={nodes[i].href}
              className="branched-menu__base"
              d={`M ${TRUNK} ${y - RADIUS} ${elbow(y)}`}
            />
          ))}
          {geometry.rows.map((y, i) => (
            <path
              key={nodes[i].href}
              className="branched-menu__reach"
              pathLength={1}
              data-on={isInPath(nodes[i].href, menu.pathname) ? "" : undefined}
              d={`M ${TRUNK} 0 V ${y - RADIUS} ${elbow(y)}`}
            />
          ))}
        </svg>
      ) : null}
      <ul ref={listRef} className="branched-menu__list">
        {nodes.map((node) => (
          <li key={node.href} className="branched-menu__branch">
            <RowHead
              item={node}
              linkClassName="branched-menu__item"
              menu={menu}
            />
            <Body item={node} menu={menu} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BranchedMenu({
  items,
  pathname,
  label,
  heading,
  toolbarStart,
}: {
  items: BranchedItem[];
  pathname: string;
  label: string;
  heading?: ReactNode;
  toolbarStart?: ReactNode;
}) {
  const [open, setOpen] = useState(() => new Set(openForPath(items, pathname)));
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen((prev) => new Set([...prev, ...openForPath(items, pathname)]));
  }

  const navRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const marker = markerRef.current;
    if (!nav || !marker) return;

    const place = (glide: boolean) => {
      const section = nav.querySelector<HTMLElement>(
        ":scope > ul > li:has(> .branched-menu__row > [data-in-path])",
      );
      if (!glide) marker.style.transition = "none";
      if (section) {
        marker.style.top = `${section.offsetTop + (HEAD - MARKER) / 2}px`;
      }
      marker.toggleAttribute("data-on", Boolean(section));
      if (!glide) {
        void marker.offsetHeight;
        marker.style.transition = "";
      }
    };

    place(true);
    let first = true;
    const observer = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      place(false);
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, [pathname]);

  const menu: MenuState = {
    pathname,
    open,
    expand: (href) => setOpen((prev) => new Set(prev).add(href)),
    toggle: (href) =>
      setOpen((prev) => {
        const next = new Set(prev);
        if (!next.delete(href)) next.add(href);
        return next;
      }),
  };

  const anyOpen = open.size > 0;
  const toggleAllLabel = anyOpen ? "Свернуть все" : "Раскрыть все";

  return (
    <>
      <div className="branched-menu__toolbar">
        {toolbarStart}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="branched-menu__tool"
          aria-label={toggleAllLabel}
          title={toggleAllLabel}
          onClick={() => setOpen(new Set(anyOpen ? [] : allParents(items)))}
        >
          {anyOpen ? <ChevronsDownUp /> : <ChevronsUpDown />}
        </Button>
      </div>
      {heading}
      <nav ref={navRef} className="branched-menu" aria-label={label}>
        <span
          ref={markerRef}
          className="branched-menu__marker"
          aria-hidden="true"
        />
        <ul className="branched-menu__sections">
          {items.map((item) => (
            <li key={item.href}>
              <RowHead
                item={item}
                linkClassName="branched-menu__head"
                menu={menu}
              />
              <Body item={item} menu={menu} />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
