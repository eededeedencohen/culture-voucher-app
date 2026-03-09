export default function Loader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 0',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--bg-card)',
        borderTop: '3px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
