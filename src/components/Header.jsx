import { useAuth } from '../contexts/AuthContext';

const roleLabels = {
  admin: 'תרבות לכל',
  student: 'סטודנט',
  business: 'בית עסק',
};

export default function Header() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <header style={{
      padding: '20px 20px 16px',
      background: 'linear-gradient(180deg, rgba(108, 99, 255, 0.15) 0%, transparent 100%)',
    }}>
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            שובר
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {roleLabels[user.role]}
          </p>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 700,
          boxShadow: 'var(--shadow-glow)',
        }}>
          {user.name?.charAt(0)}
        </div>
      </div>
    </header>
  );
}
