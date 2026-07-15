import { Construction } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 md:py-16">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mb-8 max-w-2xl text-muted-foreground">{description}</p>
      <Card className="border-dashed">
        <CardHeader className="items-center py-12 text-center">
          <Construction className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <CardTitle className="text-base">Раздел готовится</CardTitle>
          <CardDescription>
            Материалы появятся здесь в ближайшее время.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
