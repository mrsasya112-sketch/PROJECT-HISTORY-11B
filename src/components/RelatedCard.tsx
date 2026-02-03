import { useState, useCallback } from 'react';
import type { Article } from '../data/articles';

interface RelatedCardProps {
  article: Article;
  onClick: () => void;
}

// SVG плейсхолдер как data URI
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e5e5ea'/%3E%3Cstop offset='100%25' style='stop-color:%23c7c7cc'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='300'/%3E%3Cg fill='%238e8e93' transform='translate(175,125)'%3E%3Crect x='0' y='10' width='50' height='40' rx='4'/%3E%3Ccircle cx='15' cy='25' r='6'/%3E%3Cpolygon points='10,45 25,30 40,45'/%3E%3C/g%3E%3C/svg%3E";

export function RelatedCard({ article, onClick }: RelatedCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [usedFallbackUrl, setUsedFallbackUrl] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    // Сначала пробуем внешний URL fallback
    if (!usedFallbackUrl && article.thumbnailFallback) {
      setUsedFallbackUrl(true);
      e.currentTarget.src = article.thumbnailFallback;
      return;
    }
    // Если и fallback не сработал — показываем плейсхолдер
    setImageError(true);
    e.currentTarget.src = PLACEHOLDER_IMAGE;
    setImageLoaded(true);
  }, [usedFallbackUrl, article.thumbnailFallback]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <a
      href={`/news/${article.slug}.html`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      aria-label={`Читать статью: ${article.title}`}
      className="related-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-xlarge)',
        overflow: 'hidden',
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow: isHovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transform: isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
        minWidth: '260px',
        flexShrink: 0,
        scrollSnapAlign: 'start',
      }}
    >
      <figure
        style={{
          margin: 0,
          position: 'relative',
          height: '160px',
          overflow: 'hidden',
          backgroundColor: 'var(--color-bg-tertiary)',
        }}
      >
        {!imageLoaded && (
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
          src={article.thumbnail}
          alt={article.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity var(--transition-normal), transform var(--transition-slow)',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            filter: imageError ? 'grayscale(100%)' : 'none',
          }}
        />
      </figure>
      <div
        style={{
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xs)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            padding: '2px var(--spacing-sm)',
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            fontSize: '10px',
            fontWeight: 600,
            borderRadius: 'var(--radius-full)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {article.category}
        </span>
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--font-size-base)',
            fontWeight: 600,
            lineHeight: 'var(--line-height-tight)',
            letterSpacing: 'var(--letter-spacing-tight)',
            color: 'var(--color-text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.title.split(':')[0]}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--font-size-sm)',
            lineHeight: 'var(--line-height-normal)',
            color: 'var(--color-text-tertiary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.subtitle}
        </p>
      </div>
    </a>
  );
}
