import { useState, useMemo } from 'react';
import { articles } from '../data/articles';
import { Header } from './Header';
import { SearchBar } from './SearchBar';
import { NewsCard } from './NewsCard';

interface HomePageProps {
  onArticleClick: (slug: string) => void;
}

export function HomePage({ onArticleClick }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    
    const query = searchQuery.toLowerCase().trim();
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.subtitle.toLowerCase().includes(query) ||
      article.lead.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const hasResults = filteredArticles.length > 0;

  return (
    <>
      <Header />
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'var(--spacing-xl)',
          paddingBottom: 'calc(var(--spacing-5xl) + var(--safe-area-bottom))',
        }}
      >
        {/* Hero Section */}
        <section
          style={{
            textAlign: 'center',
            paddingTop: 'var(--spacing-3xl)',
            paddingBottom: 'var(--spacing-4xl)',
          }}
        >
          <h1
            style={{
              margin: 0,
              marginBottom: 'var(--spacing-md)',
              fontSize: 'clamp(var(--font-size-3xl), 6vw, var(--font-size-4xl))',
              fontWeight: 700,
              lineHeight: 'var(--line-height-tight)',
              letterSpacing: 'var(--letter-spacing-tight)',
              color: 'var(--color-text-primary)',
            }}
          >
            Культура и история Минска
          </h1>
          <p
            style={{
              margin: 0,
              marginBottom: 'var(--spacing-3xl)',
              fontSize: 'var(--font-size-lg)',
              lineHeight: 'var(--line-height-normal)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Истории людей, которые создавали белорусскую культуру и науку
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </section>

        {/* Articles Grid */}
        <section>
          {hasResults ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 'var(--spacing-2xl)',
                position: 'relative',
              }}
            >
              {articles.map((article) => {
                const isVisible = filteredArticles.some(a => a.id === article.id);
                return (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onClick={() => onArticleClick(article.slug)}
                    visible={isVisible}
                  />
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-5xl)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  marginBottom: 'var(--spacing-xl)',
                  borderRadius: 'var(--radius-2xlarge)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-quaternary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h2
                style={{
                  margin: 0,
                  marginBottom: 'var(--spacing-sm)',
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                Ничего не найдено
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-tertiary)',
                  maxWidth: '300px',
                }}
              >
                Попробуйте изменить поисковый запрос или{' '}
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--color-accent)',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  сбросьте фильтр
                </button>
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-separator)',
          padding: 'var(--spacing-2xl)',
          paddingBottom: 'calc(var(--spacing-2xl) + var(--safe-area-bottom))',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          © 2026{' '}
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Минск</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 500 }}>News</span>
          {' '}— Культура и история Минска
        </p>
      </footer>
    </>
  );
}
