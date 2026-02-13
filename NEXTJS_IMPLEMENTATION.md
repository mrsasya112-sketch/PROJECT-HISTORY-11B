# Next.js Implementation Guide для TikTok Proxy

Это демо создано на React + Vite для визуализации UI концепта.
Для полной реализации с серверным прокси на Vercel используйте следующий код:

## Структура Next.js проекта

```
/app
  /page.tsx
  /api
    /proxy
      /route.ts
/styles
  /liquid.css
```

## /app/api/proxy/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Защита от бесконечных перезапросов
const requestCache = new Map<string, number>();
const MAX_REQUESTS_PER_MINUTE = 60;

export async function GET(request: NextRequest) {
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Проверка лимита запросов
  const now = Date.now();
  const lastRequest = requestCache.get(clientIP) || 0;
  if (now - lastRequest < 1000) {
    return new NextResponse('Too many requests', { status: 429 });
  }
  requestCache.set(clientIP, now);

  try {
    // Запрос к TikTok
    const response = await fetch('https://www.tiktok.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
    });

    let html = await response.text();

    // Удаление ненужных элементов
    html = html
      // Удаление всех <script> кроме необходимых для видео
      .replace(/<script(?![^>]*src="[^"]*video[^"]*")[^>]*>[\s\S]*?<\/script>/gi, '')
      // Удаление <iframe>
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
      // Удаление <style> с рекламой
      .replace(/<style[^>]*ad[^>]*>[\s\S]*?<\/style>/gi, '')
      // Удаление header, sidebar, комментариев
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '');

    // Инжект нашего CSS
    const liquidCSS = \`
      <style>
        ${await fetch(new URL('/styles/liquid.css', request.url)).then(r => r.text())}
      </style>
    \`;

    // Инжект MutationObserver
    const cleanupScript = \`
      <script>
        (function() {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                  // Удаление рекламных элементов
                  if (node.matches('[class*="ad-"], [id*="ad-"], [class*="banner"]')) {
                    node.remove();
                  }
                  // Удаление комментариев
                  if (node.matches('[class*="comment"]')) {
                    node.remove();
                  }
                }
              });
            });
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });

          // Защита от повторных загрузок
          let loadCount = 0;
          window.addEventListener('beforeunload', () => {
            loadCount++;
            if (loadCount > 5) {
              console.warn('Too many reloads detected');
            }
          });
        })();
      </script>
    \`;

    // Вставка перед </head>
    html = html.replace('</head>', \`\${liquidCSS}\${cleanupScript}</head>\`);

    // Создание ответа с модифицированными заголовками
    const headers = new Headers();
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.set('Cache-Control', 'public, max-age=60');
    
    // Удаление CSP заголовков
    response.headers.forEach((value, key) => {
      if (!key.toLowerCase().includes('content-security-policy')) {
        headers.set(key, value);
      }
    });

    return new NextResponse(html, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Failed to fetch content', { status: 500 });
  }
}
```

## /app/page.tsx

```typescript
'use client';

export default function Home() {
  return (
    <iframe
      src="/api/proxy"
      className="w-screen h-screen border-0"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
```

## Деплой на Vercel

1. Создайте Next.js проект: \`npx create-next-app@latest\`
2. Скопируйте код выше
3. Добавьте \`liquid.css\` в \`/styles\`
4. Запустите: \`vercel --prod\`

## Важные замечания

- Edge Runtime обязателен для быстрого прокси
- CSP headers должны быть удалены
- Rate limiting защищает от злоупотреблений
- MutationObserver очищает DOM в реальном времени
- User-Agent подменяется на Chrome
- Кэширование снижает нагрузку на TikTok

## Альтернативный подход

Вместо прямого прокси HTML можно использовать TikTok API:
- TikTok Embed API (официальный)
- Использовать oEmbed endpoint
- Реверс-инжиниринг публичного API (не рекомендуется)

Удачи с деплоем! 🚀
