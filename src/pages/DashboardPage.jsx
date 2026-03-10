import { useStats } from '../hooks/useVouchers';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { TrendingUp, Ticket, CheckCircle, Clock, BarChart3, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  const { stats, loading } = useStats();

  if (loading) return <Loader />;

  const cards = [
    { label: 'סה"כ שוברים', value: stats?.total || 0, icon: Ticket, gradient: 'var(--gradient-primary)', shadow: 'rgba(108, 99, 255, 0.3)' },
    { label: 'זמינים', value: stats?.available || 0, icon: Clock, gradient: 'linear-gradient(135deg, #00D2FF 0%, #6C63FF 100%)', shadow: 'rgba(0, 210, 255, 0.3)' },
    { label: 'הוקצו', value: stats?.assigned || 0, icon: TrendingUp, gradient: 'var(--gradient-warm)', shadow: 'rgba(255, 185, 70, 0.3)' },
    { label: 'מומשו', value: stats?.redeemed || 0, icon: CheckCircle, gradient: 'var(--gradient-success)', shadow: 'rgba(0, 196, 140, 0.3)' },
  ];

  const usagePercent = stats?.totalAmount ? Math.round((stats.redeemedAmount / stats.totalAmount) * 100) : 0;

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px', animation: 'slideDown 0.4s ease' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '4px' }}>לוח בקרה</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>סקירה כללית של המערכת</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {cards.map(({ label, value, icon: Icon, gradient, shadow }, i) => (
          <div key={i} style={{
            background: gradient,
            borderRadius: 'var(--radius-md)',
            padding: '20px 16px',
            boxShadow: `0 4px 20px ${shadow}`,
            animation: `slideUp 0.35s ease ${i * 0.07}s both`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-20px', left: '-20px',
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <p style={{ fontSize: '32px', fontWeight: 900, marginBottom: '2px', lineHeight: 1, animation: `countUp 0.5s ease ${i * 0.07 + 0.2}s both` }}>{value}</p>
              <p style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <Card style={{
        marginBottom: '16px',
        animation: 'slideUp 0.4s ease 0.3s both',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(0, 196, 140, 0.05) 100%)',
        border: '1px solid rgba(0, 196, 140, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'var(--success-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart3 size={20} color="var(--success)" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800 }}>סיכום תקציב</h3>
          </div>
          <span style={{
            fontSize: '12px', fontWeight: 700, color: 'var(--success)',
            background: 'var(--success-light)', padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}>{usagePercent}% נוצל</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>תקציב כולל</span>
          <span style={{ fontWeight: 800, fontSize: '18px' }}>₪{stats?.totalAmount?.toLocaleString() || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>מומש</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpRight size={14} color="var(--success)" />
            <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '18px' }}>₪{stats?.redeemedAmount?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div style={{
          height: '10px', background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '14px',
          border: '1px solid rgba(255,255,255,0.03)',
        }}>
          <div style={{
            height: '100%', width: `${usagePercent}%`,
            background: 'var(--gradient-success)', borderRadius: 'var(--radius-full)',
            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 12px rgba(0, 196, 140, 0.4)',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>נותר</span>
          <span style={{
            fontWeight: 800, fontSize: '18px',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>₪{stats?.remainingBudget?.toLocaleString() || 0}</span>
        </div>
      </Card>

      {stats?.pendingRedeem > 0 && (
        <Card style={{
          animation: 'slideUp 0.4s ease 0.4s both',
          background: 'rgba(108, 99, 255, 0.06)',
          border: '1px solid rgba(108, 99, 255, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'rgba(108, 99, 255, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulseSoft 2s ease infinite',
            }}>
              <Clock size={20} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px' }}>{stats.pendingRedeem} שוברים ממתינים למימוש</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ברקודים פעילים כרגע</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
