import { useNavigate } from 'react-router-dom';
import { useVouchers } from '../hooks/useVouchers';
import VoucherCard from '../components/VoucherCard';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Ticket, Sparkles, History } from 'lucide-react';

export default function MyVouchersPage() {
  const { vouchers, loading } = useVouchers();
  const navigate = useNavigate();

  if (loading) return <Loader />;

  const activeVouchers = vouchers.filter(v => v.status === 'assigned');
  const pendingVouchers = vouchers.filter(v => v.status === 'pending_redeem');
  const otherVouchers = vouchers.filter(v => v.status !== 'assigned' && v.status !== 'pending_redeem');
  const totalAvailable = activeVouchers.reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: 'rgba(108, 99, 255, 0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Ticket size={22} color="var(--primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900 }}>השוברים שלי</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{vouchers.length} שוברים</p>
        </div>
      </div>

      {activeVouchers.length > 0 && (
        <Card glow style={{
          marginBottom: '24px', textAlign: 'center', padding: '24px',
          background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.08) 0%, rgba(0, 210, 255, 0.06) 100%)',
          border: '1px solid rgba(108, 99, 255, 0.15)',
          animation: 'slideUp 0.35s ease both',
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>זמין למימוש</p>
          <p style={{
            fontSize: '42px', fontWeight: 900, lineHeight: 1.1,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>₪{totalAvailable}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>{activeVouchers.length} שוברים זמינים</p>
        </Card>
      )}

      {activeVouchers.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', animation: 'slideUp 0.35s ease 0.05s both' }}>
            <Sparkles size={14} color="var(--primary)" />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700 }}>זמינים למימוש ({activeVouchers.length})</p>
          </div>
          {activeVouchers.map((v, i) => (
            <div key={v._id} style={{ animation: `slideUp 0.35s ease ${0.08 + i * 0.05}s both` }}>
              <VoucherCard voucher={v} onClick={() => navigate(`/generate?id=${v._id}`)} />
            </div>
          ))}
        </>
      )}

      {pendingVouchers.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', marginTop: '20px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulseSoft 1.5s ease infinite' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700 }}>בתהליך מימוש ({pendingVouchers.length})</p>
          </div>
          {pendingVouchers.map((v) => <VoucherCard key={v._id} voucher={v} />)}
        </>
      )}

      {otherVouchers.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', marginTop: '24px' }}>
            <History size={14} color="var(--text-muted)" />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>היסטוריה ({otherVouchers.length})</p>
          </div>
          {otherVouchers.map((v) => <div key={v._id} style={{ opacity: 0.75 }}><VoucherCard voucher={v} /></div>)}
        </>
      )}

      {vouchers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', animation: 'fadeIn 0.5s ease' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'rgba(108, 99, 255, 0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', animation: 'float 3s ease-in-out infinite',
          }}>
            <Ticket size={42} color="var(--primary)" style={{ opacity: 0.3 }} />
          </div>
          <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>עוד אין לך שוברים</p>
          <p style={{ fontSize: '14px' }}>שוברים שיוקצו לך יופיעו כאן</p>
        </div>
      )}
    </div>
  );
}
