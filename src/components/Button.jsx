export default function Button({ children, onClick, variant = 'primary', disabled, style, fullWidth }) {
  const variants = {
    primary: {
      background: 'var(--gradient-primary)',
      color: '#fff',
    },
    success: {
      background: 'var(--gradient-success)',
      color: '#fff',
    },
    danger: {
      background: 'var(--gradient-danger)',
      color: '#fff',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        padding: '14px 28px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '15px',
        fontWeight: 600,
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        boxShadow: variant !== 'ghost' ? 'var(--shadow-md)' : 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
