import { useStats } from '../hooks/useVouchers';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { TrendingUp, Ticket, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { stats, loading } = useStats();

  if (loading) return <Loader />;

  const cards = [
    { label: 'סה"כ שוברים', value: stats?.total || 0, icon: Ticket, gradient: 'var(--gradient-primary)' },
    { label: 'שוברים זמינים', value: stats?.available || 0, icon: Clock, gradient: 'linear-gradient(135deg, #00D2FF 0%, #6C63FF 100%)' },
    { label: 'הוקצו לסטודנטים', value: stats?.assigned || 0, icon: TrendingUp, gradient: 'var(--gradient-warm)' },
    { label: 'מומשו', value: stats?.redeemed || 0, icon: CheckCircle, gradient: 'var(--gradient-success)' },
  ];

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>
        לוח בקרה
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {cards.map(({ label, value, icon: Icon, gradient }, i) => (
          <Card key={i} style={{
            background: gradient,
            animation: `slideUp 0.3s ease ${i * 0.1}s both`,
          }}>
            <Icon size={24} style={{ marginBottom: '8px', opacity: 0.9 }} />
            <p style={{ fontSize: '28px', fontWeight: 900, marginBottom: '4px' }}>{value}</p>
            <p style={{ fontSize: '12px', opacity: 0.85 }}>{label}</p>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <DollarSign size={20} color="var(--success)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>סיכום תקציב</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>תקציב כולל</span>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>₪{stats?.totalAmount || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>מומש</span>
          <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '16px' }}>₪{stats?.redeemedAmount || 0}</span>
        </div>
        <div style={{
          height: '8px',
          background: 'var(--bg-input)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '8px',
        }}>
          <div style={{
            height: '100%',
            width: `${stats?.totalAmount ? (stats.redeemedAmount / stats.totalAmount * 100) : 0}%`,
            background: 'var(--gradient-success)',
            borderRadius: '4px',
            transition: 'width 1s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>נותר</span>
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '16px' }}>₪{stats?.remainingBudget || 0}</span>
        </div>
      </Card>
    </div>
  );
}
