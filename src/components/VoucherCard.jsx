import { Ticket, Clock, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import Card from './Card';

const statusConfig = {
  available: { label: 'זמין', color: 'var(--accent)', bg: 'rgba(0, 210, 255, 0.1)', icon: Ticket },
  assigned: { label: 'הוקצה', color: 'var(--warning)', bg: 'rgba(255, 185, 70, 0.1)', icon: Clock },
  pending_redeem: { label: 'ממתין למימוש', color: 'var(--primary)', bg: 'rgba(108, 99, 255, 0.1)', icon: AlertCircle },
  redeemed: { label: 'מומש', color: 'var(--success)', bg: 'rgba(0, 196, 140, 0.1)', icon: CheckCircle },
  expired: { label: 'פג תוקף', color: 'var(--danger)', bg: 'rgba(255, 90, 95, 0.1)', icon: AlertCircle },
};

export default function VoucherCard({ voucher, onClick, showStudent, style: cardStyle }) {
  const config = statusConfig[voucher.status] || statusConfig.available;
  const StatusIcon = config.icon;

  return (
    <Card
      onClick={onClick}
      style={{
        marginBottom: '12px',
        position: 'relative',
        overflow: 'hidden',
        padding: '18px 18px 18px 16px',
        ...cardStyle,
      }}
    >
      {/* Status accent bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        bottom: '12px',
        right: 0,
        width: '3px',
        background: config.color,
        borderRadius: '0 3px 3px 0',
        boxShadow: `0 0 8px ${config.color}40`,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '8px',
              background: config.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <StatusIcon size={14} color={config.color} />
            </div>
            <span style={{
              fontSize: '11px', color: config.color, fontWeight: 700,
              background: config.bg,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.02em',
            }}>
              {config.label}
            </span>
          </div>
          <p style={{
            fontSize: '12px', color: 'var(--text-muted)',
            marginBottom: '3px', fontFamily: 'monospace',
            opacity: 0.7,
          }}>
            {voucher.code}
          </p>
          {voucher.description && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {voucher.description}
            </p>
          )}
          {showStudent && voucher.assignedTo && (
            <p style={{
              fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              {voucher.assignedTo.name}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'rgba(108, 99, 255, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            textAlign: 'center',
            border: '1px solid rgba(108, 99, 255, 0.08)',
          }}>
            <span style={{
              fontSize: '20px',
              fontWeight: 900,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ₪{voucher.amount}
            </span>
          </div>
          <ChevronLeft size={16} color="var(--text-muted)" style={{ opacity: onClick ? 0.5 : 0 }} />
        </div>
      </div>
    </Card>
  );
}
