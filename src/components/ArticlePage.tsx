import { useState, useCallback } from 'react';
import type { Article } from '../data/articles';
import { getRelatedArticles, articles } from '../data/articles';
import { Header } from './Header';
import { ShareButtons } from './ShareButtons';
import { RelatedCard } from './RelatedCard';

// SVG плейсхолдер как data URI
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e5e5ea'/%3E%3Cstop offset='100%25' style='stop-color:%23c7c7cc'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1600' height='900'/%3E%3Cg fill='%238e8e93' transform='translate(725,375)'%3E%3Crect x='0' y='20' width='150' height='120' rx='8'/%3E%3Ccircle cx='45' cy='75' r='20'/%3E%3Cpolygon points='30,130 75,80 120,130'/%3E%3C/g%3E%3C/svg%3E";

interface ArticlePageProps {
  article: Article;
  onBack: () => void;
  onArticleClick: (slug: string) => void;
}

export function ArticlePage({ article, onBack, onArticleClick }: ArticlePageProps) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroError, setHeroError] = useState(false);
  const [usedFallbackUrl, setUsedFallbackUrl] = useState(false);
  
  // Получаем все статьи для блока "Читайте также" (показываем все 3, включая текущую убираем)
  const relatedArticles = getRelatedArticles(article.slug);
  // Если меньше 3-х, добавим еще из всех статей
  const allRelated = relatedArticles.length >= 2 
    ? relatedArticles 
    : articles.filter(a => a.slug !== article.slug).slice(0, 3);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/news/${article.slug}.html` 
    : `/news/${article.slug}.html`;

  const handleHeroError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    // Сначала пробуем внешний URL fallback
    if (!usedFallbackUrl && article.heroImageFallback) {
      setUsedFallbackUrl(true);
      e.currentTarget.src = article.heroImageFallback;
      return;
    }
    // Если и fallback не сработал — показываем плейсхолдер
    setHeroError(true);
    e.currentTarget.src = PLACEHOLDER_IMAGE;
    setHeroLoaded(true);
  }, [usedFallbackUrl, article.heroImageFallback]);

  const handleHeroLoad = useCallback(() => {
    setHeroLoaded(true);
  }, []);

  return (
    <>
      <Header showBackButton onBack={onBack} />
      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'var(--spacing-xl)',
          paddingBottom: 'calc(var(--spacing-5xl) + var(--safe-area-bottom))',
        }}
      >
        <article>
          {/* Hero Image */}
          <figure
            style={{
              margin: 0,
              marginBottom: 'var(--spacing-3xl)',
              borderRadius: 'var(--radius-2xlarge)',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '16 / 9',
              backgroundColor: 'var(--color-bg-tertiary)',
            }}
          >
            {!heroLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-secondary) 50%, var(--color-bg-tertiary) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            )}
            <img
              src={article.heroImage}
              alt={article.heroCaption}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={handleHeroLoad}
              onError={handleHeroError}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: heroLoaded ? 1 : 0,
                transition: 'opacity var(--transition-normal)',
                filter: heroError ? 'grayscale(100%)' : 'none',
              }}
            />
            <figcaption
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-5xl)',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                color: 'white',
                fontSize: 'var(--font-size-sm)',
                lineHeight: 'var(--line-height-normal)',
              }}
            >
              {article.heroCaption}
            </figcaption>
          </figure>

          {/* Meta Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-xl)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-accent)',
                color: 'white',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {article.category}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 500,
                borderRadius: 'var(--radius-full)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <time dateTime="2026-01-31">{article.date}</time>
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 500,
                borderRadius: 'var(--radius-full)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {article.author}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              margin: 0,
              marginBottom: 'var(--spacing-xl)',
              fontSize: 'clamp(var(--font-size-2xl), 5vw, var(--font-size-4xl))',
              fontWeight: 700,
              lineHeight: 'var(--line-height-tight)',
              letterSpacing: 'var(--letter-spacing-tight)',
              color: 'var(--color-text-primary)',
            }}
          >
            {article.title}
          </h1>

          {/* Lead */}
          <p
            style={{
              margin: 0,
              marginBottom: 'var(--spacing-3xl)',
              fontSize: 'var(--font-size-lg)',
              lineHeight: 'var(--line-height-relaxed)',
              color: 'var(--color-text-secondary)',
              fontStyle: 'italic',
              paddingLeft: 'var(--spacing-xl)',
              borderLeft: '4px solid var(--color-accent)',
            }}
          >
            {article.lead}
          </p>

          {/* Content Sections */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3xl)',
            }}
          >
            {article.sections.map((section, sectionIndex) => (
              <section key={sectionIndex}>
                {section.title && (
                  <h2
                    style={{
                      margin: 0,
                      marginBottom: 'var(--spacing-lg)',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 600,
                      lineHeight: 'var(--line-height-tight)',
                      letterSpacing: 'var(--letter-spacing-tight)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {section.title}
                  </h2>
                )}
                {section.content.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    style={{
                      margin: 0,
                      marginBottom: pIndex < section.content.length - 1 ? 'var(--spacing-lg)' : 0,
                      fontSize: 'var(--font-size-md)',
                      lineHeight: 'var(--line-height-relaxed)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Share Section */}
          <div
            style={{
              marginTop: 'var(--spacing-5xl)',
              paddingTop: 'var(--spacing-3xl)',
              borderTop: '1px solid var(--color-separator)',
            }}
          >
            <ShareButtons url={shareUrl} title={article.title} />
          </div>
        </article>

        {/* Related Articles - iOS Style Carousel */}
        <section
          style={{
            marginTop: 'var(--spacing-5xl)',
            paddingTop: 'var(--spacing-3xl)',
            borderTop: '1px solid var(--color-separator)',
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: 'var(--spacing-2xl)',
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            Читайте также
          </h2>
          
          {/* Desktop: Grid 3 columns, Mobile: Horizontal scroll */}
          <div
            className="related-articles-container"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {allRelated.map((relatedArticle) => (
              <RelatedCard
                key={relatedArticle.id}
                article={relatedArticle}
                onClick={() => onArticleClick(relatedArticle.slug)}
              />
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Mobile: Horizontal scroll carousel */
        @media (max-width: 768px) {
          .related-articles-container {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            gap: 12px !important;
            padding-bottom: 6px !important;
            margin-left: calc(-1 * var(--spacing-xl)) !important;
            margin-right: calc(-1 * var(--spacing-xl)) !important;
            padding-left: var(--spacing-xl) !important;
            padding-right: var(--spacing-xl) !important;
          }
          
          .related-articles-container::-webkit-scrollbar {
            display: none;
          }
          
          .related-articles-container {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .related-card {
            scroll-snap-align: start !important;
            min-width: 260px !important;
            flex-shrink: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
