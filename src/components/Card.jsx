export default function Card({ children, style, gradient, onClick, glow, glass }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: gradient || (glass ? 'var(--gradient-glass)' : 'var(--bg-card)'),
        backdropFilter: glass ? 'var(--blur-md)' : undefined,
        WebkitBackdropFilter: glass ? 'var(--blur-md)' : undefined,
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        border: glow
          ? '1px solid rgba(108, 99, 255, 0.25)'
          : '1px solid rgba(255, 255, 255, 0.04)',
        boxShadow: glow ? 'var(--shadow-glow)' : 'var(--shadow-card)',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      onMouseEnter={onClick ? (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = glow ? 'var(--shadow-glow)' : 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.15)';
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = glow ? 'var(--shadow-glow)' : 'var(--shadow-card)';
        e.currentTarget.style.borderColor = glow ? 'rgba(108, 99, 255, 0.25)' : 'rgba(255, 255, 255, 0.04)';
      } : undefined}
    >
      {children}
    </div>
  );
}
