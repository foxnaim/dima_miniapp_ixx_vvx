// Утилита для совместимости роутинга между React Router и Next.js
'use client';

import { useRouter, usePathname, useParams as useNextParams } from 'next/navigation';

// Хук для навигации (замена useNavigate из react-router)
export function useNavigate() {
  const router = useRouter();
  
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      // Если передано число, делаем go back/forward
      if (to === -1) {
        router.back();
      } else if (to === 1) {
        router.forward();
      }
    } else {
      // Если строка, делаем навигацию
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  };
}

// Хук для получения текущего пути (замена useLocation из react-router)
export function useLocation() {
  const pathname = usePathname();
  
  return {
    pathname,
    search: typeof window !== 'undefined' ? window.location.search : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null, // Next.js не поддерживает state в навигации
  };
}

// Хук для получения параметров маршрута (замена useParams из react-router)
export function useParams<T extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>>(): T {
  return useNextParams() as T;
}

