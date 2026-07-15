import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { findNavPath, getAllNavPaths, navHref } from "@/lib/navigation";

export function generateStaticParams() {
  return getAllNavPaths().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const chain = findNavPath(slug);
  if (!chain) return {};
  return { title: chain[chain.length - 1].title };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const chain = findNavPath(slug);
  if (!chain) notFound();

  const node = chain[chain.length - 1];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {node.title}
        </h1>
        <p className="text-muted-foreground">
          {node.children?.length
            ? "Выберите подраздел."
            : "Ответы этого раздела появятся здесь."}
        </p>
      </div>

      {node.children?.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {node.children.map((child) => (
            <Link key={child.slug} href={navHref([...slug, child.slug])}>
              <Card className="group h-full transition-colors hover:border-primary/40">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2 text-base">
                    <span>{child.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </CardTitle>
                  <CardDescription>
                    {child.children?.length
                      ? `${child.children.length} подразделов`
                      : "Ответы раздела"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader className="items-center py-12 text-center">
            <MessageCircleQuestion className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <CardTitle className="text-base">Раздел готовится</CardTitle>
            <CardDescription>
              Вопросы и ответы будут добавлены после загрузки базы.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
