interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 'var(--spacing-md)',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-tertiary)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        type="search"
        placeholder="Поиск статей..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          paddingLeft: '44px',
          fontSize: 'var(--font-size-md)',
          fontFamily: 'var(--font-family)',
          backgroundColor: 'var(--color-bg-tertiary)',
          border: 'none',
          borderRadius: 'var(--radius-medium)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          transition: 'background-color var(--transition-fast), box-shadow var(--transition-fast)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent)33';
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: 'var(--spacing-sm)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-text-quaternary)',
            border: 'none',
            borderRadius: '50%',
            color: 'var(--color-bg-primary)',
            cursor: 'pointer',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-text-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-text-quaternary)'}
          aria-label="Очистить поиск"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
