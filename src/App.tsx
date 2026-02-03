import { useState, useEffect } from 'react';
import { getArticleBySlug } from './data/articles';
import { HomePage } from './components/HomePage';
import { ArticlePage } from './components/ArticlePage';

type Page = 
  | { type: 'home' }
  | { type: 'article'; slug: string };

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>({ type: 'home' });

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/news/') && path.endsWith('.html')) {
        const slug = path.replace('/news/', '').replace('.html', '');
        const article = getArticleBySlug(slug);
        if (article) {
          setCurrentPage({ type: 'article', slug });
          return;
        }
      }
      setCurrentPage({ type: 'home' });
    };

    window.addEventListener('popstate', handlePopState);
    
    // Check initial URL
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToArticle = (slug: string) => {
    setCurrentPage({ type: 'article', slug });
    window.history.pushState({}, '', `/news/${slug}.html`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentPage({ type: 'home' });
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage.type === 'article') {
    const article = getArticleBySlug(currentPage.slug);
    if (article) {
      return (
        <ArticlePage
          article={article}
          onBack={navigateToHome}
          onArticleClick={navigateToArticle}
        />
      );
    }
  }

  return (
    <HomePage onArticleClick={navigateToArticle} />
  );
}
