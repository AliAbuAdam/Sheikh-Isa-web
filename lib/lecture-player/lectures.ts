import demoOne from "./demo/demo-1.json";
import demoTwo from "./demo/demo-2.json";

export type Lecture = {
  id: string;
  title: string;
  src: string;
  duration: number;
  peaks: number[];
  /** Страница, где опубликована запись: на неё ведёт «Вернуться к источнику». */
  sourceHref: string;
  /** Квадратная обложка 512×512 для экрана блокировки, например обложка книги. */
  cover?: string;
};

// Демо-записи синтезатором речи: заменить настоящими лекциями.
export const lectures: Lecture[] = [
  {
    id: "demo-1",
    title: "Демо-запись 1",
    src: "/audio/demo-1.mp3",
    sourceHref: "/lektsii",
    ...demoOne,
  },
  {
    id: "demo-2",
    title: "Демо-запись 2",
    src: "/audio/demo-2.mp3",
    sourceHref: "/lektsii",
    ...demoTwo,
  },
];
