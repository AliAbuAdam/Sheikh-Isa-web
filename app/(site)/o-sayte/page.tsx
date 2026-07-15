export const metadata = { title: "О сайте" };

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 md:py-16">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        О сайте
      </h1>
      <div className="space-y-4 leading-relaxed text-muted-foreground">
        <p>
          Этот сайт — официальный ресурс шейха Исы. Здесь собраны ответы на
          вопросы, записи лекций, учебная программа и книги.
        </p>
        <p>
          Основа сайта — база из почти трёх тысяч ответов на вопросы по
          вероубеждению, фикху, манхаджу и другим разделам, упорядоченных по
          темам для удобного поиска.
        </p>
        <p>
          Материалы можно свободно распространять в неизменном виде с указанием
          источника.
        </p>
      </div>
    </div>
  );
}
