import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, QrCode, ScanLine, Settings, LogOut, Ticket, Users, History, User } from 'lucide-react';
import { useVibrate } from '../hooks/useVibrate';

const navItems = {
  admin: [
    { path: '/dashboard', icon: Home, label: 'ראשי' },
    { path: '/vouchers', icon: Ticket, label: 'שוברים' },
    { path: '/students', icon: Users, label: 'סטודנטים' },
    { path: '/settings', icon: Settings, label: 'הגדרות' },
    { path: '/profile', icon: User, label: 'פרופיל' },
  ],
  student: [
    { path: '/my-vouchers', icon: Ticket, label: 'השוברים שלי' },
    { path: '/generate', icon: QrCode, label: 'מימוש' },
    { path: '/profile', icon: User, label: 'פרופיל' },
  ],
  business: [
    { path: '/scanner', icon: ScanLine, label: 'סריקה' },
    { path: '/history', icon: History, label: 'היסטוריה' },
    { path: '/profile', icon: User, label: 'פרופיל' },
  ],
};

export default function BottomNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { tapVibrate } = useVibrate();

  if (!user) return null;

  const items = navItems[user.role] || [];
  const allItems = [...items, { path: '__logout__', icon: LogOut, label: 'יציאה' }];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(10, 10, 26, 0.92)',
      backdropFilter: 'var(--blur-lg)',
      WebkitBackdropFilter: 'var(--blur-lg)',
      borderTop: '1px solid rgba(108, 99, 255, 0.12)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 1000,
      height: 'var(--nav-height)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        width: '100%',
        maxWidth: '480px',
        padding: '0 4px',
        overflow: 'hidden',
      }}>
        {allItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          const isLogout = path === '__logout__';
          return (
            <button
              key={path}
              onClick={() => {
                tapVibrate();
                if (isLogout) { logout(); } else { navigate(path); }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                background: 'none',
                color: isLogout ? 'var(--text-muted)' : isActive ? 'var(--primary-light)' : 'var(--text-muted)',
                padding: '6px 2px',
                flex: '1 1 0',
                minWidth: 0,
                borderRadius: 0,
                transition: 'all var(--transition-fast)',
                position: 'relative',
              }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '2px',
                  background: 'var(--gradient-primary)',
                  borderRadius: '0 0 4px 4px',
                  animation: 'fadeIn 0.2s ease',
                }} />
              )}
              <div style={{
                width: '36px',
                height: '28px',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? 'rgba(108, 99, 255, 0.12)' : 'transparent',
                transition: 'all var(--transition-fast)',
              }}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
