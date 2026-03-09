import { Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Card from './Card';

const statusConfig = {
  available: { label: 'זמין', color: 'var(--accent)', icon: Ticket },
  assigned: { label: 'הוקצה', color: 'var(--warning)', icon: Clock },
  pending_redeem: { label: 'ממתין למימוש', color: 'var(--primary)', icon: AlertCircle },
  redeemed: { label: 'מומש', color: 'var(--success)', icon: CheckCircle },
  expired: { label: 'פג תוקף', color: 'var(--danger)', icon: AlertCircle },
};

export default function VoucherCard({ voucher, onClick, showStudent }) {
  const config = statusConfig[voucher.status] || statusConfig.available;
  const StatusIcon = config.icon;

  return (
    <Card
      onClick={onClick}
      style={{
        marginBottom: '12px',
        animation: 'slideUp 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '4px',
        height: '100%',
        background: config.color,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <StatusIcon size={16} color={config.color} />
            <span style={{ fontSize: '12px', color: config.color, fontWeight: 600 }}>
              {config.label}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {voucher.code}
          </p>
          {voucher.description && (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {voucher.description}
            </p>
          )}
          {showStudent && voucher.assignedTo && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {voucher.assignedTo.name}
            </p>
          )}
        </div>
        <div style={{
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 16px',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: '22px',
            fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ₪{voucher.amount}
          </span>
        </div>
      </div>
    </Card>
  );
}
