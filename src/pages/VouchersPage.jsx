import { useState } from 'react';
import { useVouchers } from '../hooks/useVouchers';
import { voucherAPI, userAPI } from '../services/api';
import VoucherCard from '../components/VoucherCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Plus, X, UserPlus, Ticket, Package, Mail, GraduationCap, CalendarClock, Hash, FileText, DollarSign, ChevronLeft } from 'lucide-react';

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
      {/* Page Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '28px', animation: 'slideDown 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'rgba(108, 99, 255, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Ticket size={22} color="var(--primary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '2px' }}>ניהול שוברים</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>יצירה, הקצאה וניהול שוברים</p>
          </div>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} variant={showCreate ? 'ghost' : 'primary'}>
          {showCreate ? <X size={18} /> : <><Plus size={18} /> חדש</>}
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <Card style={{
          marginBottom: '20px',
          animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(108, 99, 255, 0.04) 100%)',
          border: '1px solid rgba(108, 99, 255, 0.1)',
        }} glow>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Package size={18} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>יצירת שוברים</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>הזן פרטים ליצירת שוברים חדשים</p>
            </div>
          </div>
          <form onSubmit={handleCreate}>
            <div style={{ animation: 'slideUp 0.3s ease 0.05s both' }}>
              <Input label="סכום (₪)" type="number" value={createForm.amount}
                onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })} required icon={DollarSign} />
            </div>
            <div style={{ animation: 'slideUp 0.3s ease 0.1s both' }}>
              <Input label="תיאור" value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} icon={FileText} />
            </div>
            <div style={{ animation: 'slideUp 0.3s ease 0.15s both' }}>
              <Input label="כמות" type="number" value={createForm.count}
                onChange={(e) => setCreateForm({ ...createForm, count: e.target.value })} min="1" icon={Hash} />
            </div>
            <div style={{ animation: 'slideUp 0.3s ease 0.2s both' }}>
              <Input label="תאריך תפוגה" type="date" value={createForm.expiryDate}
                onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })} required icon={CalendarClock} />
            </div>
            <div style={{ animation: 'slideUp 0.3s ease 0.25s both', marginTop: '8px' }}>
              <Button fullWidth type="submit" disabled={submitting}>
                {submitting ? 'יוצר...' : 'צור שוברים'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Assign Modal */}
      {showAssign && (
        <div
          onClick={() => setShowAssign(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '480px',
              maxHeight: '70vh',
              background: 'var(--bg-primary)',
              borderRadius: '24px 24px 0 0',
              overflow: 'hidden',
              animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 20px 0',
              position: 'sticky', top: 0,
              background: 'var(--bg-primary)',
              zIndex: 1,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'var(--success-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <UserPlus size={20} color="var(--success)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>הקצה שובר לסטודנט</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>בחר סטודנט מהרשימה</p>
                  </div>
                </div>
                <button onClick={() => setShowAssign(null)} style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)', transition: 'var(--transition-base)',
                }}>
                  <X size={18} />
                </button>
              </div>

              {/* Voucher Info Badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px',
                background: 'rgba(108, 99, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(108, 99, 255, 0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ticket size={16} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '15px' }}>₪{showAssign.amount}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{showAssign.code}</p>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div style={{ padding: '0 20px 20px', overflowY: 'auto', flex: 1 }}>
              {students.map((s, i) => (
                <div
                  key={s._id}
                  onClick={() => handleAssign(s._id)}
                  style={{
                    padding: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    animation: `slideUp 0.3s ease ${i * 0.04}s both`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: 'var(--gradient-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '18px', flexShrink: 0,
                    }}>
                      {s.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{s.name}</p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} /> {s.email}
                        </span>
                        {s.studentId && (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <GraduationCap size={12} /> {s.studentId}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronLeft size={18} color="var(--text-muted)" />
                  </div>
                </div>
              ))}
              {students.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(108, 99, 255, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <UserPlus size={28} color="var(--primary)" style={{ opacity: 0.5 }} />
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>אין סטודנטים רשומים</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>הוסף סטודנטים דרך עמוד הסטודנטים</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Voucher List */}
      {vouchers.map((v, i) => (
        <div key={v._id} style={{ animation: `slideUp 0.3s ease ${i * 0.04}s both` }}>
          <VoucherCard
            voucher={v}
            showStudent
            onClick={v.status === 'available' ? () => handleAssignClick(v) : undefined}
          />
        </div>
      ))}

      {/* Empty State */}
      {vouchers.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 0',
          color: 'var(--text-muted)',
          animation: 'fadeIn 0.5s ease',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(108, 99, 255, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Ticket size={36} color="var(--primary)" style={{ opacity: 0.5 }} />
          </div>
          <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>אין שוברים עדיין</p>
          <p style={{ fontSize: '13px' }}>לחץ על "חדש" ליצירת שוברים ראשונים</p>
        </div>
      )}
    </div>
  );
}
