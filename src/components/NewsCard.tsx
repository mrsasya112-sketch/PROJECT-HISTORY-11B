import { useState } from 'react';
import type { Article } from '../data/articles';

interface NewsCardProps {
  article: Article;
  onClick: () => void;
  visible?: boolean;
}

export function NewsCard({ article, onClick, visible = true }: NewsCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      tabIndex={0}
      role="button"
      aria-label={`Читать статью: ${article.title}`}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-xlarge)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isHovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transform: isPressed ? 'scale(0.98)' : isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), opacity var(--transition-normal)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        position: visible ? 'relative' : 'absolute',
        height: visible ? 'auto' : 0,
      }}
    >
      <figure
        style={{
          margin: 0,
          position: 'relative',
          aspectRatio: '16 / 10',
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
          onLoad={() => setImageLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity var(--transition-normal), transform var(--transition-slow)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      </figure>
      <div
        style={{
          padding: 'var(--spacing-xl)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            borderRadius: 'var(--radius-full)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          {article.category}
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            lineHeight: 'var(--line-height-tight)',
            letterSpacing: 'var(--letter-spacing-tight)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-sm)',
          }}
        >
          {article.title.split(':')[0]}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--font-size-base)',
            lineHeight: 'var(--line-height-normal)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {article.subtitle}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <time dateTime="2026-01-31">{article.date}</time>
          <span style={{ color: 'var(--color-separator-opaque)' }}>•</span>
          <span>{article.author}</span>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </article>
  );
}
