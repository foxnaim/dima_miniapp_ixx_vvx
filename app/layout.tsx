import type { Metadata, Viewport } from 'next';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Providers } from './providers';
import '../styles/globals.css';
import Script from 'next/script';

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL || 'https://miniapp.local'),
  title: {
    default: 'Mini Shop | Telegram-магазин',
    template: '%s | Mini Shop',
  },
  description: 'Mini Shop — быстрый Telegram-магазин с категориями, корзиной и онлайн-оплатой.',
  keywords: ['telegram shop', 'мини-магазин', 'telegram mini app', 'доставка', 'онлайн магазин'],
  authors: [{ name: 'Mini Shop' }],
  creator: 'Mini Shop',
  publisher: 'Mini Shop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'Mini Shop',
    title: 'Mini Shop | Telegram-магазин',
    description: 'Mini Shop — быстрый Telegram-магазин с категориями, корзиной и онлайн-оплатой.',
    images: [
      {
        url: 'https://dummyimage.com/1200x630/09090b/ffffff&text=Mini+Shop',
        width: 1200,
        height: 630,
        alt: 'Mini Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini Shop | Telegram-магазин',
    description: 'Mini Shop — быстрый Telegram-магазин с категориями, корзиной и онлайн-оплатой.',
    images: ['https://dummyimage.com/1200x630/09090b/ffffff&text=Mini+Shop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Mini Shop',
              url: process.env.NEXT_PUBLIC_VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL || 'https://miniapp.local',
              applicationCategory: 'ShoppingApplication',
              operatingSystem: 'All',
              description: 'Telegram mini app для оформления заказов и управления каталогом.',
            }),
          }}
        />
        <Script id="telegram-log-filter" strategy="beforeInteractive">
          {`
            (function() {
              const originalLog = console.log;
              const originalWarn = console.warn;
              const originalInfo = console.info;
              const originalError = console.error;
              
              const filterTelegramLogs = (...args) => {
                for (const arg of args) {
                  const str = typeof arg === 'string' ? arg : (arg?.toString?.() || JSON.stringify(arg) || '');
                  if (str.includes('[Telegram.WebView]') || str.includes('postEvent')) {
                    return false;
                  }
                }
                return true;
              };
              
              console.log = function(...args) {
                if (filterTelegramLogs(...args)) {
                  originalLog.apply(console, args);
                }
              };
              
              console.warn = function(...args) {
                if (filterTelegramLogs(...args)) {
                  originalWarn.apply(console, args);
                }
              };
              
              console.info = function(...args) {
                if (filterTelegramLogs(...args)) {
                  originalInfo.apply(console, args);
                }
              };
              
              console.error = function(...args) {
                if (filterTelegramLogs(...args)) {
                  originalError.apply(console, args);
                }
              };
            })();
          `}
        </Script>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <Script id="prevent-zoom" strategy="beforeInteractive">
          {`
            (function() {
              let viewport = document.querySelector('meta[name="viewport"]');
              let initialScale = 1;
              
              function preventZoom() {
                if (viewport) {
                  viewport.setAttribute('content', 
                    'width=device-width, initial-scale=' + initialScale + ', maximum-scale=' + initialScale + ', minimum-scale=' + initialScale + ', user-scalable=no, viewport-fit=cover'
                  );
                }
              }
              
              function resetZoom() {
                if (viewport) {
                  viewport.setAttribute('content', 
                    'width=device-width, initial-scale=' + initialScale + ', maximum-scale=' + initialScale + ', minimum-scale=' + initialScale + ', user-scalable=no, viewport-fit=cover'
                  );
                }
                document.body.style.zoom = '1';
                document.body.style.transform = 'scale(1)';
                if (document.documentElement.style.zoom !== undefined) {
                  document.documentElement.style.zoom = '1';
                  document.documentElement.style.transform = 'scale(1)';
                }
                const inputs = document.querySelectorAll('input, textarea');
                inputs.forEach(function(input) {
                  input.style.zoom = '1';
                  input.style.transform = 'scale(1)';
                });
              }
              
              preventZoom();
              
              window.addEventListener('orientationchange', function() {
                setTimeout(preventZoom, 100);
              });
              
              function attachZoomPrevention() {
                const inputs = document.querySelectorAll('input, textarea');
                inputs.forEach(function(input) {
                  input.removeEventListener('focus', resetZoom);
                  input.removeEventListener('blur', resetZoom);
                  input.removeEventListener('touchstart', resetZoom);
                  input.removeEventListener('click', resetZoom);
                  
                  input.addEventListener('focus', function() {
                    resetZoom();
                    setTimeout(resetZoom, 50);
                    setTimeout(resetZoom, 100);
                  }, { passive: true });
                  input.addEventListener('blur', resetZoom, { passive: true });
                  input.addEventListener('touchstart', resetZoom, { passive: true });
                  input.addEventListener('touchend', resetZoom, { passive: true });
                  input.addEventListener('click', resetZoom, { passive: true });
                  
                  if (input.tagName === 'TEXTAREA') {
                    input.style.fontSize = '16px';
                    input.style.webkitTextSizeAdjust = '100%';
                  }
                });
              }
              
              document.addEventListener('DOMContentLoaded', attachZoomPrevention);
              
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                        if (node.tagName === 'TEXTAREA') {
                          node.style.fontSize = '16px';
                          node.style.webkitTextSizeAdjust = '100%';
                        }
                        node.addEventListener('touchstart', resetZoom, { passive: true });
                        node.addEventListener('focus', resetZoom, { passive: true });
                        node.addEventListener('blur', resetZoom, { passive: true });
                        node.addEventListener('click', resetZoom, { passive: true });
                      }
                      const inputs = node.querySelectorAll ? node.querySelectorAll('input, textarea') : [];
                      inputs.forEach(function(input) {
                        if (input.tagName === 'TEXTAREA') {
                          input.style.fontSize = '16px';
                          input.style.webkitTextSizeAdjust = '100%';
                        }
                        input.addEventListener('touchstart', resetZoom, { passive: true });
                        input.addEventListener('focus', resetZoom, { passive: true });
                        input.addEventListener('blur', resetZoom, { passive: true });
                        input.addEventListener('click', resetZoom, { passive: true });
                      });
                    }
                  });
                  attachZoomPrevention();
                });
              });
              
              if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
              } else {
                document.addEventListener('DOMContentLoaded', function() {
                  observer.observe(document.body, { childList: true, subtree: true });
                });
              }
            })();
          `}
        </Script>
      </head>
      <body>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

