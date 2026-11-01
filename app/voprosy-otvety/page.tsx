import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { answersMenu, navHref } from "@/lib/navigation";

function countLeaves(nodes: typeof answersMenu): number {
  return nodes.reduce(
    (sum, node) =>
      sum + (node.children?.length ? countLeaves(node.children) : 1),
    0
  );
}

export const metadata = {
  title: "Вопросы и ответы",
};

export default function AnswersHome() {
  const topicsCount = countLeaves(answersMenu);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-10 sm:px-6 md:pb-16">
      <div className="mb-10 space-y-4">
        <Badge variant="secondary">
          {answersMenu.length} разделов · {topicsCount} тем
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Вопросы и ответы
        </h1>
        <p className="max-w-2xl text-muted-foreground text-balance">
          Около трёх тысяч ответов на вопросы по вероубеждению, фикху, манхаджу
          и другим разделам. Выберите раздел в меню слева или воспользуйтесь
          поиском.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {answersMenu.map((category) => (
          <Link key={category.slug} href={navHref([category.slug])}>
            <Card className="group h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2 text-base">
                  <span>{category.title}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </CardTitle>
                <CardDescription>
                  {category.children?.length
                    ? `${category.children.length} подразделов`
                    : "Ответы раздела"}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
