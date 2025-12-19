/* eslint-disable */
/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // Оптимизация изображений
  images: {
    unoptimized: true, // Отключаем оптимизацию для статики
  },
  // Переменные окружения для клиентской стороны (с префиксом NEXT_PUBLIC_)
  env: {
    NEXT_PUBLIC_VITE_API_URL: process.env.NEXT_PUBLIC_VITE_API_URL || process.env.VITE_API_URL || '/api',
    NEXT_PUBLIC_VITE_PUBLIC_URL: process.env.NEXT_PUBLIC_VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL || process.env.RAILWAY_PUBLIC_DOMAIN || 'http://localhost:3000',
    NEXT_PUBLIC_VITE_ADMIN_IDS: process.env.NEXT_PUBLIC_VITE_ADMIN_IDS || process.env.VITE_ADMIN_IDS || '',
  },
  // Настройка для API прокси
  async rewrites() {
    // В production на Railway/других платформах API на том же домене
    const apiUrl = process.env.NEXT_PUBLIC_VITE_API_URL || process.env.VITE_API_URL;
    
    // Если это относительный путь или не указан, используем внутренний прокси
    if (!apiUrl || apiUrl.startsWith('/')) {
      // В production (Railway/Docker) FastAPI на порту 8000 (внутренний)
      // Next.js проксирует /api запросы на FastAPI
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ];
    }
    
    // Внешний API URL (для dev режима)
    let destination = apiUrl.trim();
    if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
      destination = `https://${destination}`;
    }
    destination = destination.replace(/\/api\/?$/, '').replace(/\/$/, '');
    
    return [
      {
        source: '/api/:path*',
        destination: `${destination}/api/:path*`,
      },
    ];
  },
  // Оптимизация сборки
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Экспериментальные функции для производительности
  experimental: {
    optimizePackageImports: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
  },
  // Указываем корень проекта для устранения предупреждения о workspace
  outputFileTracingRoot: path.join(__dirname),
  // Временно отключаем проверку типов во время сборки для обхода бага Next.js с генерацией типов
  typescript: {
    ignoreBuildErrors: true,
  },
  // Исключаем src/pages из поиска страниц (это компоненты, а не Pages Router)
  // Используем только файлы page.tsx/page.ts в app/ директории
  pageExtensions: ['page.tsx', 'page.ts'],
  // Production output для интеграции с FastAPI
  output: 'standalone',
};

module.exports = nextConfig;

