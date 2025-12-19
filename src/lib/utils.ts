import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Кэшируем вычисления для buildApiAssetUrl
let cachedApiBaseUrl: string | null = null;
let cachedApiOrigin: string | null = null;
let cachedApiBasePath: string | null = null;
const httpRegex = /^https?:\/\//;
const trailingSlashRegex = /\/$/;
const apiSuffixRegex = /\/api$/;

function getCachedApiBase() {
  if (cachedApiBaseUrl === null && cachedApiOrigin === null) {
    if (httpRegex.test(API_BASE_URL)) {
      const apiUrl = new URL(API_BASE_URL);
      cachedApiOrigin = apiUrl.origin;
      const trimmedPath = apiUrl.pathname.replace(trailingSlashRegex, "");
      cachedApiBasePath = apiSuffixRegex.test(trimmedPath) ? trimmedPath.slice(0, -4) : trimmedPath;
    } else {
      cachedApiBaseUrl = apiSuffixRegex.test(API_BASE_URL)
        ? API_BASE_URL.slice(0, -4)
        : API_BASE_URL.replace(trailingSlashRegex, "");
    }
  }
  return { origin: cachedApiOrigin, basePath: cachedApiBasePath, baseUrl: cachedApiBaseUrl };
}

export const buildApiAssetUrl = (path?: string) => {
  if (!path) return "";
  if (httpRegex.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const { origin, basePath, baseUrl } = getCachedApiBase();

  if (origin && basePath) {
    return `${origin}${basePath}${normalizedPath}`;
  }

  return `${baseUrl}${normalizedPath}`;
};
