import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Шейх Иса — официальный сайт",
  description:
    "Уроки, лекции, статьи и ответы на вопросы. Официальный сайт шейха Исы.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={cn(
        "h-full antialiased font-sans",
        inter.variable,
        lora.variable
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
