import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { siteNav } from "@/lib/site-nav";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="font-semibold">Шейх Иса</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {siteNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-5" />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Официальный сайт шейха Исы.
        </p>
      </div>
    </footer>
  );
}
