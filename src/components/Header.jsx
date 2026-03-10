import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const roleLabels = {
  admin: 'תרבות לכל',
  student: 'סטודנט',
  business: 'בית עסק',
};

const roleIcons = {
  admin: '👑',
  student: '🎓',
  business: '🏪',
};

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <header style={{
      padding: '16px 20px 12px',
      background: 'linear-gradient(180deg, rgba(108, 99, 255, 0.1) 0%, transparent 100%)',
      position: 'relative',
    }}>
      {/* Subtle top gradient line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px',
        background: 'var(--gradient-primary)',
        opacity: 0.5,
      }} />

      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 2px 12px rgba(108, 99, 255, 0.3)',
          }}>
            🎫
          </div>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 900,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
            }}>
              שובר
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
              {roleIcons[user.role]} {roleLabels[user.role]}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          style={{
            width: '40px', height: '40px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 800,
            boxShadow: '0 2px 16px rgba(108, 99, 255, 0.3)',
            border: '2px solid rgba(255,255,255,0.1)',
            color: '#fff',
            transition: 'all var(--transition-base)',
          }}
        >
          {user.name?.charAt(0)}
        </button>
      </div>
    </header>
  );
}
