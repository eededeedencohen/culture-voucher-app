export default function Card({ children, style, gradient, onClick, glow }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: gradient || 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        border: '1px solid rgba(108, 99, 255, 0.1)',
        boxShadow: glow ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
