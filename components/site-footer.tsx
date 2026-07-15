import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="font-heading font-semibold">Шейх Иса</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="#about" className="hover:text-foreground">
              О шейхе
            </Link>
            <Link href="#lessons" className="hover:text-foreground">
              Уроки
            </Link>
            <Link href="#books" className="hover:text-foreground">
              Книги и статьи
            </Link>
            <Link href="#qa" className="hover:text-foreground">
              Вопрос — ответ
            </Link>
            <Link href="#contact" className="hover:text-foreground">
              Контакты
            </Link>
          </nav>
        </div>
        <Separator className="my-6" />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Официальный сайт шейха Исы. Все права
          защищены.
        </p>
      </div>
    </footer>
  );
}
