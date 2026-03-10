export default function Button({ children, onClick, variant = 'primary', disabled, style, fullWidth, type }) {
  const variants = {
    primary: {
      background: 'var(--gradient-primary)',
      color: '#fff',
      boxShadow: 'var(--shadow-button)',
    },
    success: {
      background: 'var(--gradient-success)',
      color: '#fff',
      boxShadow: '0 4px 16px rgba(0, 196, 140, 0.35), 0 2px 4px rgba(0,0,0,0.2)',
    },
    danger: {
      background: 'var(--gradient-danger)',
      color: '#fff',
      boxShadow: '0 4px 16px rgba(255, 90, 95, 0.35), 0 2px 4px rgba(0,0,0,0.2)',
    },
    ghost: {
      background: 'rgba(108, 99, 255, 0.08)',
      color: 'var(--primary-light)',
      border: '1px solid rgba(108, 99, 255, 0.25)',
      boxShadow: 'none',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        padding: '15px 28px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '15px',
        fontWeight: 700,
        letterSpacing: '0.01em',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.45 : 1,
        transition: 'all var(--transition-base)',
        transform: 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      onMouseEnter={!disabled ? (e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.filter = 'brightness(1.1)';
      } : undefined}
      onMouseLeave={!disabled ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.filter = 'brightness(1)';
      } : undefined}
      onTouchStart={!disabled ? (e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
      } : undefined}
      onTouchEnd={!disabled ? (e) => {
        e.currentTarget.style.transform = 'scale(1)';
      } : undefined}
    >
      {children}
    </button>
  );
}
