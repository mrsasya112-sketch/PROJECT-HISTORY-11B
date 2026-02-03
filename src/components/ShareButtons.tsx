import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

interface ShareButton {
  name: string;
  icon: React.ReactNode;
  getUrl: (url: string, title: string) => string;
  color: string;
}

const shareButtons: ShareButton[] = [
  {
    name: 'Telegram',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    getUrl: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    color: '#0088cc',
  },
  {
    name: 'Twitter',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    getUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    color: '#000000',
  },
  {
    name: 'Facebook',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    color: '#1877f2',
  },
  {
    name: 'VK',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.657 4 8.2c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.847 2.49 2.27 4.676 2.853 4.676.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.492-.085.745-.576.745z"/>
      </svg>
    ),
    getUrl: (url, title) => `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    color: '#0077ff',
  },
];

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 'var(--font-size-sm)',
          fontWeight: 600,
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Поделиться
      </h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)',
        }}
      >
        {shareButtons.map((button) => (
          <ShareButtonItem
            key={button.name}
            button={button}
            onClick={() => handleShare(button.getUrl(url, title))}
          />
        ))}
        <button
          onClick={handleCopyLink}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            backgroundColor: copiedLink ? 'var(--color-success)' : 'var(--color-bg-tertiary)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            color: copiedLink ? 'white' : 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 500,
            fontFamily: 'var(--font-family)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          {copiedLink ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Скопировано
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Копировать ссылку
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ShareButtonItem({ button, onClick }: { button: ShareButton; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Поделиться в ${button.name}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        backgroundColor: isHovered ? button.color : 'var(--color-bg-tertiary)',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        color: isHovered ? 'white' : 'var(--color-text-secondary)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 500,
        fontFamily: 'var(--font-family)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
    >
      {button.icon}
      <span>{button.name}</span>
    </button>
  );
}
