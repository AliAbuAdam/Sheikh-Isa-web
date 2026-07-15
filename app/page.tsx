import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Mail,
  MapPin,
  PlayCircle,
  ScrollText,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const lessons = {
  aqidah: [
    {
      title: "Основы вероубеждения",
      description: "Цикл уроков по основам исламского вероубеждения.",
      lessons: 12,
    },
    {
      title: "Разъяснение «Трёх основ»",
      description: "Подробный разбор классического труда для начинающих.",
      lessons: 8,
    },
  ],
  fiqh: [
    {
      title: "Фикх очищения и молитвы",
      description: "Практические положения тахарата и намаза с доводами.",
      lessons: 15,
    },
    {
      title: "Фикх поста и закята",
      description: "Положения поста в Рамадан и выплаты закята.",
      lessons: 10,
    },
  ],
  tafsir: [
    {
      title: "Тафсир суры «аль-Фатиха»",
      description: "Смыслы величайшей суры Корана, аят за аятом.",
      lessons: 5,
    },
    {
      title: "Тафсир джуза «Амма»",
      description: "Разъяснение коротких сур последнего джуза.",
      lessons: 20,
    },
  ],
};

const books = [
  {
    title: "Разъяснение основ религии",
    description:
      "Книга о фундаментальных вопросах вероубеждения, написанная доступным языком.",
    tag: "Книга",
  },
  {
    title: "Наставления ищущему знание",
    description:
      "Сборник советов для студентов, вставших на путь религиозного знания.",
    tag: "Книга",
  },
  {
    title: "Терпение в час испытаний",
    description:
      "Статья о том, как верующему встречать трудности и сохранять довольство Аллахом.",
    tag: "Статья",
  },
];

const faq = [
  {
    question: "Как задать шейху вопрос?",
    answer:
      "Воспользуйтесь формой в разделе «Контакты» или напишите на электронную почту. Вопросы рассматриваются по мере возможности; наиболее полезные из них публикуются в разделе «Вопрос — ответ».",
  },
  {
    question: "Где проходят уроки и можно ли присутствовать лично?",
    answer:
      "Расписание очных уроков публикуется в объявлениях. Записи всех уроков доступны онлайн в разделе «Уроки».",
  },
  {
    question: "Можно ли распространять материалы сайта?",
    answer:
      "Да, материалы можно свободно распространять в неизменном виде с указанием источника — с намерением донести пользу.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-accent/60 to-background">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
            <Badge variant="secondary" className="gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              Официальный сайт
            </Badge>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Шейх Иса
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground text-balance">
              Уроки, лекции, книги и ответы на вопросы — знание, основанное на
              Коране и Сунне, изложенное ясным и доступным языком.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="#lessons">
                  <PlayCircle className="h-5 w-5" />
                  Смотреть уроки
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">Задать вопрос</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* О шейхе */}
        <section id="about" className="scroll-mt-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[auto_1fr] md:gap-14 md:py-24">
            <div className="flex justify-center md:block">
              <Avatar className="h-40 w-40 border md:h-48 md:w-48">
                <AvatarFallback className="bg-accent font-heading text-4xl text-accent-foreground">
                  ШИ
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-4">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                О шейхе
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                Шейх Иса — исламский учёный и преподаватель, посвятивший многие
                годы изучению и преподаванию шариатских наук: вероубеждения,
                фикха, тафсира и хадиса. Его уроки отличает опора на достоверные
                источники, ясность изложения и внимание к вопросам, с которыми
                сталкиваются мусульмане сегодня.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                На этом сайте собраны записи уроков и лекций, книги и статьи
                шейха, а также ответы на вопросы читателей.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">Вероубеждение</Badge>
                <Badge variant="outline">Фикх</Badge>
                <Badge variant="outline">Тафсир</Badge>
                <Badge variant="outline">Хадис</Badge>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Уроки */}
        <section id="lessons" className="scroll-mt-16 bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <div className="mb-10 space-y-3 text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                Уроки и лекции
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Циклы уроков по основным шариатским дисциплинам. Каждый цикл
                можно изучать последовательно, урок за уроком.
              </p>
            </div>
            <Tabs defaultValue="aqidah">
              <TabsList className="mx-auto mb-8 flex w-fit">
                <TabsTrigger value="aqidah">Вероубеждение</TabsTrigger>
                <TabsTrigger value="fiqh">Фикх</TabsTrigger>
                <TabsTrigger value="tafsir">Тафсир</TabsTrigger>
              </TabsList>
              {(
                [
                  ["aqidah", lessons.aqidah],
                  ["fiqh", lessons.fiqh],
                  ["tafsir", lessons.tafsir],
                ] as const
              ).map(([key, items]) => (
                <TabsContent key={key} value={key}>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {items.map((item) => (
                      <Card key={item.title}>
                        <CardHeader>
                          <CardTitle className="font-heading text-xl">
                            {item.title}
                          </CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {item.lessons} уроков
                          </Badge>
                          <Button variant="outline" size="sm">
                            <PlayCircle className="h-4 w-4" />
                            Слушать
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Книги и статьи */}
        <section id="books" className="scroll-mt-16">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <div className="mb-10 space-y-3 text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                Книги и статьи
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Печатные труды и статьи шейха, доступные для чтения и скачивания.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {books.map((book) => (
                <Card key={book.title} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        {book.tag === "Книга" ? (
                          <BookOpen className="h-5 w-5" />
                        ) : (
                          <ScrollText className="h-5 w-5" />
                        )}
                      </span>
                      <Badge variant="outline">{book.tag}</Badge>
                    </div>
                    <CardTitle className="font-heading text-xl">
                      {book.title}
                    </CardTitle>
                    <CardDescription>{book.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Button variant="outline" size="sm">
                      Читать
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Вопрос — ответ */}
        <section id="qa" className="scroll-mt-16 bg-muted/40">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
            <div className="mb-10 space-y-3 text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                Вопрос — ответ
              </h2>
              <p className="text-muted-foreground">
                Ответы на часто задаваемые вопросы.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faq.map((item, i) => (
                <AccordionItem key={item.question} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Контакты */}
        <section id="contact" className="scroll-mt-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                Задать вопрос
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                Если у вас есть вопрос по религии или предложение по работе
                сайта — напишите нам. Наиболее полезные вопросы и ответы на них
                публикуются на сайте.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    info@example.com
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    Адрес уточняется
                  </span>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">
                  Форма обратной связи
                </CardTitle>
                <CardDescription>
                  Заполните поля ниже — мы ответим на указанную почту.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" placeholder="Ваше имя" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Электронная почта</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Вопрос</Label>
                  <Textarea
                    id="message"
                    placeholder="Сформулируйте ваш вопрос…"
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Отправить</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
