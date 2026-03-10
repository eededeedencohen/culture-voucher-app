export default function Loader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 0',
      gap: '20px',
    }}>
      <div style={{ position: 'relative', width: '48px', height: '48px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid rgba(108, 99, 255, 0.1)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid transparent',
          borderTopColor: 'var(--primary)',
          borderRightColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: '8px',
          border: '3px solid transparent',
          borderBottomColor: 'var(--primary-light)',
          borderRadius: '50%',
          animation: 'spin 1.2s linear infinite reverse',
        }} />
      </div>
      <p style={{
        fontSize: '13px',
        color: 'var(--text-muted)',
        fontWeight: 500,
        animation: 'breathe 1.5s ease-in-out infinite',
      }}>
        טוען...
      </p>
    </div>
  );
}
