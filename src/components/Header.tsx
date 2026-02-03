import { useState, useEffect } from 'react';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ showBackButton = false, onBack }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingTop: 'var(--safe-area-top)',
        backgroundColor: 'var(--color-bg-glass)',
        backdropFilter: `blur(var(--header-blur))`,
        WebkitBackdropFilter: `blur(var(--header-blur))`,
        borderBottom: scrolled ? '1px solid var(--color-separator)' : '1px solid transparent',
        transition: 'border-color var(--transition-fast), background-color var(--transition-fast)',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--header-height)',
          padding: '0 var(--spacing-lg)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {showBackButton ? (
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              fontSize: 'var(--font-size-md)',
              fontWeight: 400,
              cursor: 'pointer',
              padding: 'var(--spacing-sm)',
              marginLeft: 'calc(-1 * var(--spacing-sm))',
              borderRadius: 'var(--radius-medium)',
              transition: 'opacity var(--transition-fast)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Назад</span>
          </button>
        ) : (
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onBack?.(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 'var(--spacing-xs)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 700,
                letterSpacing: 'var(--letter-spacing-tight)',
                color: 'var(--color-text-primary)',
              }}
            >
              Минск
            </span>
            <span
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 700,
                letterSpacing: 'var(--letter-spacing-tight)',
                color: 'var(--color-accent)',
              }}
            >
              News
            </span>
          </a>
        )}

        {!showBackButton && (
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-tertiary)',
              fontWeight: 500,
            }}
          >
            Культура и история
          </span>
        )}

        {showBackButton && (
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onBack?.(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: '2px',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              Минск
            </span>
            <span
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 600,
                color: 'var(--color-accent)',
              }}
            >
              News
            </span>
          </a>
        )}
      </nav>
    </header>
  );
}
