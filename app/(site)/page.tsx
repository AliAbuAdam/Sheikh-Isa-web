import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MessagesSquare,
  PlayCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { answersMenu } from "@/lib/navigation";

const sections = [
  {
    href: "/voprosy-otvety",
    title: "Вопросы-ответы",
    description: `База ответов по ${answersMenu.length} разделам — от вероубеждения до быта.`,
    icon: MessagesSquare,
  },
  {
    href: "/lektsii",
    title: "Лекции",
    description: "Записи уроков и лекций по шариатским дисциплинам.",
    icon: PlayCircle,
  },
  {
    href: "/uchebnaya-programma",
    title: "Учебная программа",
    description: "Последовательная программа изучения религиозных наук.",
    icon: GraduationCap,
  },
  {
    href: "/knigi",
    title: "Книги",
    description: "Книги и переводы, доступные для чтения и скачивания.",
    icon: BookOpen,
  },
];

export default function Home() {
  return (
    <>
      <section className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Знание, основанное на Коране и Сунне
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground text-balance">
            Официальный сайт шейха Исы: база из почти трёх тысяч ответов на
            вопросы, лекции, учебная программа и книги.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/voprosy-otvety">
                Вопросы-ответы
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/lektsii">Лекции</Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <Link key={section.href} href={section.href}>
                <Card className="group h-full transition-colors hover:border-primary/40">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
                        <section.icon className="h-5 w-5" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
