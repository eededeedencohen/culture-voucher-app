import { useState } from 'react';
import { useVouchers } from '../hooks/useVouchers';
import { voucherAPI, userAPI } from '../services/api';
import VoucherCard from '../components/VoucherCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Plus, X, UserPlus } from 'lucide-react';

export default function VouchersPage() {
  const { vouchers, loading, refetch } = useVouchers();
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState(null);
  const [students, setStudents] = useState([]);
  const [createForm, setCreateForm] = useState({
    amount: '', description: '', count: 1,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await voucherAPI.create({
        ...createForm,
        amount: Number(createForm.amount),
        count: Number(createForm.count),
      });
      setShowCreate(false);
      setCreateForm({ amount: '', description: '', count: 1, expiryDate: createForm.expiryDate });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignClick = async (voucher) => {
    setShowAssign(voucher);
    try {
      const { data } = await userAPI.getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async (studentId) => {
    try {
      await voucherAPI.assign(showAssign._id, studentId);
      setShowAssign(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>ניהול שוברים</h1>
        <Button onClick={() => setShowCreate(!showCreate)} variant={showCreate ? 'ghost' : 'primary'}>
          {showCreate ? <X size={18} /> : <><Plus size={18} /> חדש</>}
        </Button>
      </div>

      {showCreate && (
        <Card style={{ marginBottom: '20px', animation: 'slideUp 0.3s ease' }} glow>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>יצירת שוברים</h3>
          <form onSubmit={handleCreate}>
            <Input label="סכום (₪)" type="number" value={createForm.amount}
              onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })} required />
            <Input label="תיאור" value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />
            <Input label="כמות" type="number" value={createForm.count}
              onChange={(e) => setCreateForm({ ...createForm, count: e.target.value })} min="1" />
            <Input label="תאריך תפוגה" type="date" value={createForm.expiryDate}
              onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })} required />
            <Button fullWidth type="submit" disabled={submitting}>
              {submitting ? 'יוצר...' : 'צור שוברים'}
            </Button>
          </form>
        </Card>
      )}

      {/* Assign Modal */}
      {showAssign && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }} onClick={() => setShowAssign(null)}>
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '60vh', overflowY: 'auto',
            animation: 'slideUp 0.3s ease',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
              <UserPlus size={20} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
              הקצה שובר לסטודנט
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              שובר: {showAssign.code} - ₪{showAssign.amount}
            </p>
            {students.map((s) => (
              <Card key={s._id} onClick={() => handleAssign(s._id)}
                style={{ marginBottom: '8px', padding: '14px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{s.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.email}</p>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.studentId}</span>
                </div>
              </Card>
            ))}
            {students.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                אין סטודנטים רשומים
              </p>
            )}
          </div>
        </div>
      )}

      {vouchers.map((v) => (
        <VoucherCard
          key={v._id}
          voucher={v}
          showStudent
          onClick={v.status === 'available' ? () => handleAssignClick(v) : undefined}
        />
      ))}

      {vouchers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎫</p>
          <p>אין שוברים עדיין</p>
        </div>
      )}
    </div>
  );
}
