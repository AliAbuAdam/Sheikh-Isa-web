import { LectureList } from "@/components/lecture-player/lecture-list";

export const metadata = { title: "Лекции" };

export default function LecturesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Лекции</h1>
      <p className="mt-2 mb-8 text-muted-foreground">
        Записи уроков и лекций шейха по шариатским дисциплинам.
      </p>
      <LectureList />
    </div>
  );
}
