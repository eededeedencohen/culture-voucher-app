import { useNavigate } from 'react-router-dom';
import { useVouchers } from '../hooks/useVouchers';
import VoucherCard from '../components/VoucherCard';
import Loader from '../components/Loader';
import { Ticket } from 'lucide-react';

export default function MyVouchersPage() {
  const { vouchers, loading } = useVouchers();
  const navigate = useNavigate();

  if (loading) return <Loader />;

  const activeVouchers = vouchers.filter(v => v.status === 'assigned');
  const otherVouchers = vouchers.filter(v => v.status !== 'assigned');

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Ticket size={24} color="var(--primary)" />
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>השוברים שלי</h1>
      </div>

      {activeVouchers.length > 0 && (
        <>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>
            זמינים למימוש ({activeVouchers.length})
          </p>
          {activeVouchers.map((v) => (
            <VoucherCard
              key={v._id}
              voucher={v}
              onClick={() => navigate(`/generate?id=${v._id}`)}
            />
          ))}
        </>
      )}

      {otherVouchers.length > 0 && (
        <>
          <p style={{
            fontSize: '13px', color: 'var(--text-muted)',
            marginBottom: '12px', marginTop: '24px', fontWeight: 600,
          }}>
            היסטוריה ({otherVouchers.length})
          </p>
          {otherVouchers.map((v) => (
            <VoucherCard key={v._id} voucher={v} />
          ))}
        </>
      )}

      {vouchers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '64px', marginBottom: '16px' }}>🎫</p>
          <p style={{ fontSize: '18px', fontWeight: 600 }}>עוד אין לך שוברים</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>שוברים שיוקצו לך יופיעו כאן</p>
        </div>
      )}
    </div>
  );
}
