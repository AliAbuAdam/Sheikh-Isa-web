export type NavNode = {
  title: string;
  slug: string;
  children?: NavNode[];
};

// Дерево «Меню ответов» (Linear WEB-18).
// Уровни: категория (•••) → раздел (••) → тема (—).
export const answersMenu: NavNode[] = [
  {
    title: "Вероубеждение",
    slug: "veroubezhdenie",
    children: [
      { title: "Единобожие", slug: "edinobozhie" },
      { title: "Имена и атрибуты Аллаха", slug: "imena-i-atributy-allaha" },
      { title: "Пророки", slug: "proroki" },
      { title: "Многобожие", slug: "mnogobozhie" },
      { title: "О лицемерии", slug: "o-litsemerii" },
      { title: "Судный день", slug: "sudnyy-den" },
      { title: "Вера и неверие", slug: "vera-i-neverie" },
      { title: "Загробная жизнь", slug: "zagrobnaya-zhizn" },
      { title: "Об ангелах и джиннах", slug: "ob-angelah-i-dzhinnah" },
      { title: "Рай и Ад", slug: "ray-i-ad" },
      { title: "Дружба и непричастность", slug: "druzhba-i-neprichastnost" },
      { title: "Предопределение", slug: "predopredelenie" },
      { title: "Сны", slug: "sny" },
      { title: "Разное", slug: "raznoe" },
    ],
  },
  { title: "Для принявших ислам", slug: "dlya-prinyavshih-islam" },
  {
    title: "Фикх (право)",
    slug: "fikh",
    children: [
      {
        title: "Намаз",
        slug: "namaz",
        children: [
          { title: "Фарды (обязательные молитвы)", slug: "fardy" },
          {
            title: "Дополнительные молитвы (Сунны)",
            slug: "dopolnitelnye-molitvy",
          },
          {
            title: "Истихара (испрашивание благословения)",
            slug: "istihara",
          },
          { title: "Дуа в намазе", slug: "dua-v-namaze" },
          { title: "Времена намазов", slug: "vremena-namazov" },
          { title: "Ошибки в намазе", slug: "oshibki-v-namaze" },
          { title: "Джума (пятничная молитва)", slug: "dzhuma" },
          { title: "Джамаат (коллективная молитва)", slug: "dzhamaat" },
          {
            title: "Оставление и возмещение",
            slug: "ostavlenie-i-vozmeschenie",
          },
          { title: "Молитва путника", slug: "molitva-putnika" },
          { title: "Ташаххуд (салават, аттахият)", slug: "tashahhud" },
          { title: "Азан/Икамат", slug: "azan-ikamat" },
          { title: "Другое", slug: "drugoe" },
        ],
      },
      {
        title: "Омовение",
        slug: "omovenie",
        children: [
          { title: "Полное омовение (гусль)", slug: "gusl" },
          { title: "Малое омовение (вуду)", slug: "vudu" },
          { title: "Таяммум (омовение без воды)", slug: "tayammum" },
          { title: "Масх (протирание)", slug: "maskh" },
        ],
      },
      {
        title: "Рамадан и пост (Ураза)",
        slug: "ramadan-i-post",
        children: [
          { title: "Начало/Конец Рамадана", slug: "nachalo-konets-ramadana" },
          { title: "Условия и столпы", slug: "usloviya-i-stolpy" },
          { title: "Что нарушает пост", slug: "chto-narushaet-post" },
          { title: "Что НЕ нарушает пост", slug: "chto-ne-narushaet-post" },
          { title: "Сёстрам о посте", slug: "syostram-o-poste" },
          {
            title: "Искупление и возмещение",
            slug: "iskuplenie-i-vozmeschenie",
          },
          {
            title: "Ночь предопределения (лейлятуль кадр)",
            slug: "noch-predopredeleniya",
          },
          { title: "Закят аль-фитр", slug: "zakyat-al-fitr" },
          { title: "Добровольный пост", slug: "dobrovolnyy-post" },
          { title: "Разное про пост", slug: "raznoe-pro-post" },
        ],
      },
      { title: "Жертвоприношение", slug: "zhertvoprinoshenie" },
      { title: "Праздники в исламе", slug: "prazdniki-v-islame" },
      { title: "Закят и садака", slug: "zakyat-i-sadaka" },
      { title: "Хадж и умра (паломничество)", slug: "hadzh-i-umra" },
      { title: "Джаназа и обряды похорон", slug: "dzhanaza" },
    ],
  },
  {
    title: "Манхадж",
    slug: "manhadzh",
    children: [
      { title: "Саляфия", slug: "salyafiya" },
      { title: "Нововведения", slug: "novovvedeniya" },
      { title: "Такфир (выведение из религии)", slug: "takfir" },
      {
        title: "Заблудшие личности и секты",
        slug: "zabludshie-lichnosti-i-sekty",
      },
    ],
  },
  { title: "Коран и тафсир", slug: "koran-i-tafsir" },
  {
    title: "Хадисы и асары",
    slug: "hadisy-i-asary",
    children: [
      { title: "Хадисы и асары", slug: "hadisy" },
      { title: "Книги", slug: "knigi" },
    ],
  },
  { title: "Знания и призыв", slug: "znaniya-i-prizyv" },
  { title: "Хиджра", slug: "hidzhra" },
  { title: "Родственные связи", slug: "rodstvennye-svyazi" },
  { title: "Грехи и покаяние", slug: "grehi-i-pokayanie" },
  {
    title: "Адаб и ахляк (нравственность)",
    slug: "adab-i-ahlyak",
    children: [
      { title: "Адабы", slug: "adaby" },
      {
        title: "Приветствие и взаимоотношения",
        slug: "privetstvie-i-vzaimootnosheniya",
      },
    ],
  },
  { title: "Духовное воспитание", slug: "duhovnoe-vospitanie" },
  { title: "Испытания и терпение", slug: "ispytaniya-i-terpenie" },
  {
    title: "Дуа и азкары",
    slug: "dua-i-azkary",
    children: [
      {
        title: "Сихр (колдовство)/сглаз/рукъйа (заклинания)",
        slug: "sihr-sglaz-rukya",
      },
      { title: "Дуа — его правила и запреты", slug: "pravila-i-zaprety-dua" },
      {
        title: "Дуа на различные случаи в жизни",
        slug: "dua-na-raznye-sluchai",
      },
      {
        title: "Времена, когда дуа принимаются чаще",
        slug: "vremena-prinyatiya-dua",
      },
    ],
  },
  {
    title: "Брак и развод",
    slug: "brak-i-razvod",
    children: [
      { title: "Наставления семьям", slug: "nastavleniya-semyam" },
      { title: "Отношения полов", slug: "otnosheniya-polov" },
      { title: "Бракосочетание (никах)", slug: "nikah" },
      { title: "Сватовство/валима", slug: "svatovstvo-valima" },
      { title: "Многожёнство", slug: "mnogozhyonstvo" },
      { title: "Интим", slug: "intim" },
      { title: "Семья и дети", slug: "semya-i-deti" },
      { title: "Рождение и воспитание", slug: "rozhdenie-i-vospitanie" },
      { title: "Имена и имянаречение", slug: "imena-i-imyanarechenie" },
      { title: "Развод", slug: "razvod" },
    ],
  },
  {
    title: "Сёстрам",
    slug: "syostram",
    children: [
      { title: "Наставления", slug: "nastavleniya" },
      { title: "Хайд (месячные)", slug: "hayd" },
    ],
  },
  {
    title: "Внешность",
    slug: "vneshnost",
    children: [
      { title: "Одежда и украшения", slug: "odezhda-i-ukrasheniya" },
      { title: "Никаб", slug: "nikab" },
      { title: "Внешний вид", slug: "vneshniy-vid" },
    ],
  },
  {
    title: "Торговля и финансы",
    slug: "torgovlya-i-finansy",
    children: [
      { title: "Торговые сделки", slug: "torgovye-sdelki" },
      { title: "Наследство", slug: "nasledstvo" },
      {
        title: "Имущественные отношения",
        slug: "imuschestvennye-otnosheniya",
      },
      { title: "Долги", slug: "dolgi" },
      { title: "Работа", slug: "rabota" },
      { title: "Риба", slug: "riba" },
    ],
  },
  { title: "Медицина", slug: "meditsina" },
  { title: "Еда и питьё", slug: "eda-i-pityo" },
  { title: "Про животных", slug: "pro-zhivotnyh" },
  { title: "Клятва/обет/обещания", slug: "klyatva-obet-obeschaniya" },
  { title: "Социальные проблемы", slug: "sotsialnye-problemy" },
  { title: "Досуг и развлечения", slug: "dosug-i-razvlecheniya" },
  { title: "Разные фетвы", slug: "raznye-fetvy" },
];

/** Находит цепочку узлов по сегментам URL; null, если путь не существует. */
export function findNavPath(segments: string[]): NavNode[] | null {
  const chain: NavNode[] = [];
  let level: NavNode[] | undefined = answersMenu;
  for (const segment of segments) {
    const node: NavNode | undefined = level?.find((n) => n.slug === segment);
    if (!node) return null;
    chain.push(node);
    level = node.children;
  }
  return chain;
}

/** Все допустимые пути дерева — для generateStaticParams. */
export function getAllNavPaths(): string[][] {
  const paths: string[][] = [];
  const walk = (nodes: NavNode[], prefix: string[]) => {
    for (const node of nodes) {
      const current = [...prefix, node.slug];
      paths.push(current);
      if (node.children) walk(node.children, current);
    }
  };
  walk(answersMenu, []);
  return paths;
}

/** Базовый путь раздела «Вопросы-ответы». */
export const answersBasePath = "/voprosy-otvety";

export function navHref(segments: string[]): string {
  return `${answersBasePath}/${segments.join("/")}`;
}
