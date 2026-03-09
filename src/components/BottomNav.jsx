import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, QrCode, ScanLine, Settings, LogOut, Ticket, Users } from 'lucide-react';

const navItems = {
  admin: [
    { path: '/dashboard', icon: Home, label: 'ראשי' },
    { path: '/vouchers', icon: Ticket, label: 'שוברים' },
    { path: '/students', icon: Users, label: 'סטודנטים' },
    { path: '/settings', icon: Settings, label: 'הגדרות' },
  ],
  student: [
    { path: '/my-vouchers', icon: Ticket, label: 'השוברים שלי' },
    { path: '/generate', icon: QrCode, label: 'מימוש' },
  ],
  business: [
    { path: '/scanner', icon: ScanLine, label: 'סריקה' },
  ],
};

export default function BottomNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = navItems[user.role] || [];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(26, 25, 50, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(108, 99, 255, 0.2)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)',
      zIndex: 1000,
    }}>
      {items.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.2s',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 400 }}>{label}</span>
          </button>
        );
      })}
      <button
        onClick={logout}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          color: 'var(--text-muted)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          transition: 'all 0.2s',
        }}
      >
        <LogOut size={22} strokeWidth={1.5} />
        <span style={{ fontSize: '11px' }}>יציאה</span>
      </button>
    </nav>
  );
}
