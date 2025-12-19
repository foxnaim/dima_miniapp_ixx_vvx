/**
 * Request Deduplication - предотвращает дублирующие запросы
 * Если несколько компонентов запрашивают одни и те же данные одновременно,
 * выполняется только один запрос, остальные получают тот же Promise
 */

type PendingRequest<T> = {
  promise: Promise<T>;
  timestamp: number;
};

const pendingRequests = new Map<string, PendingRequest<unknown>>();
const REQUEST_TIMEOUT = 3000; // 3 секунды - оптимизировано для быстрой работы

// Оптимизированная очистка - выполняется не каждый раз, а только при необходимости
let lastCleanup = 0;
const CLEANUP_INTERVAL = 5000; // Очищаем каждые 5 секунд

function cleanupExpiredRequests() {
  const now = Date.now();
  // Очищаем только если прошло достаточно времени
  if (now - lastCleanup < CLEANUP_INTERVAL) {
    return;
  }
  lastCleanup = now;
  
  for (const [k, req] of pendingRequests.entries()) {
    if (now - req.timestamp > REQUEST_TIMEOUT) {
      pendingRequests.delete(k);
    }
  }
}

export function deduplicateRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  
  // Очищаем устаревшие запросы (только при необходимости)
  cleanupExpiredRequests();
  
  // Проверяем, есть ли уже активный запрос
  const existing = pendingRequests.get(key);
  if (existing && now - existing.timestamp < REQUEST_TIMEOUT) {
    return existing.promise as Promise<T>;
  }
  
  // Создаем новый запрос
  const promise = requestFn().finally(() => {
    // Удаляем после завершения
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, {
    promise,
    timestamp: now,
  });
  
  return promise;
}

/**
 * Создает ключ для дедупликации на основе query key (оптимизировано)
 */
export function createDedupKey(parts: readonly unknown[]): string {
  // Оптимизация для простых случаев - избегаем JSON.stringify
  if (parts.length === 1) {
    const part = parts[0];
    if (typeof part === 'string') return part;
    if (typeof part === 'number') return part.toString();
  }
  
  // Для сложных случаев используем JSON.stringify
  return JSON.stringify(parts);
}

