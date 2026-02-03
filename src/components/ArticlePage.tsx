import { useState } from 'react';
import type { Article } from '../data/articles';
import { getRelatedArticles } from '../data/articles';
import { Header } from './Header';
import { ShareButtons } from './ShareButtons';
import { NewsCard } from './NewsCard';

interface ArticlePageProps {
  article: Article;
  onBack: () => void;
  onArticleClick: (slug: string) => void;
}

export function ArticlePage({ article, onBack, onArticleClick }: ArticlePageProps) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const relatedArticles = getRelatedArticles(article.slug);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/news/${article.slug}.html` 
    : `/news/${article.slug}.html`;

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
              onLoad={() => setHeroLoaded(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: heroLoaded ? 1 : 0,
                transition: 'opacity var(--transition-normal)',
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

        {/* Related Articles */}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--spacing-xl)',
            }}
          >
            {relatedArticles.map((relatedArticle) => (
              <NewsCard
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
      `}</style>
    </>
  );
}
