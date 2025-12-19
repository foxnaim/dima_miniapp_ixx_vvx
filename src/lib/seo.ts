// Кэшируем нормализованный baseUrl
const cachedBaseUrl: string | null = null;
const trailingSlashRegex = /\/$/;

const normalizeBaseUrl = (value?: string | null) => {
  if (!value) return "https://miniapp.local";
  return value.replace(trailingSlashRegex, "");
};

export const siteConfig = {
  name: "Mini Shop",
  shortName: "Mini Shop",
  description:
    "Mini Shop — современный Telegram-магазин с каталогом, корзиной и быстрым оформлением заказа.",
  keywords: [
    "telegram shop",
    "mini app",
    "онлайн магазин",
    "доставка",
    "каталог товаров",
    "telegram mini app",
  ],
  locale: "ru_RU",
  baseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL),
  ogImage: "https://dummyimage.com/1200x630/09090b/ffffff&text=Mini+Shop",
  contactEmail: "support@miniapp.local",
};

const httpRegex = /^https?:\/\//;

export const buildCanonicalUrl = (path?: string) => {
  if (!path) return siteConfig.baseUrl;
  if (httpRegex.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.baseUrl}${normalizedPath}`;
};

