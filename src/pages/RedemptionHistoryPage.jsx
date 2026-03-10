import { useState, useEffect } from 'react';
import { voucherAPI } from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { History, Receipt, User, Calendar, TrendingUp, ArrowDownRight } from 'lucide-react';

export default function RedemptionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    voucherAPI.getHistory()
      .then(({ data }) => setTransactions(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('he-IL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '28px',
        animation: 'fadeIn 0.4s ease both',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(108, 99, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <History size={22} color="var(--primary)" />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '2px' }}>היסטוריית מימושים</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>מעקב אחר כל המימושים שביצעת</p>
        </div>
        <span style={{
          background: 'var(--gradient-primary)',
          color: '#fff',
          borderRadius: 'var(--radius-full)',
          padding: '4px 14px',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
          animation: 'fadeInScale 0.5s ease 0.2s both',
        }}>
          {transactions.length}
        </span>
      </div>

      {/* Summary Card */}
      {transactions.length > 0 && (
        <Card glow style={{
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.12) 0%, rgba(0, 196, 140, 0.08) 100%)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          animation: 'slideUp 0.4s ease both',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative background element */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 196, 140, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ArrowDownRight size={14} color="var(--text-muted)" />
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>סה"כ מומש</p>
              </div>
              <p style={{
                fontSize: '36px',
                fontWeight: 900,
                background: 'var(--gradient-success)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                lineHeight: 1,
              }}>
                ₪{totalAmount}
              </p>
              <p style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '8px',
              }}>
                ב-{transactions.length} עסקאות
              </p>
            </div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              background: 'var(--gradient-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 196, 140, 0.3)',
              animation: 'breathe 3s ease-in-out infinite',
            }}>
              <TrendingUp size={28} color="#fff" />
            </div>
          </div>
        </Card>
      )}

      {/* Transaction List */}
      {transactions.map((t, i) => (
        <Card key={t._id} style={{
          marginBottom: '12px',
          animation: `slideUp 0.4s ease ${i * 0.06}s both`,
          transition: 'var(--transition-base)',
          padding: '16px 18px',
          background: 'var(--bg-card)',
          border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.15), rgba(0, 210, 255, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(0, 196, 140, 0.1)',
            }}>
              <Receipt size={20} color="var(--success)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{
                  fontWeight: 800,
                  fontSize: '16px',
                  background: 'var(--gradient-success)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  ₪{t.amount}
                </p>
                <span style={{
                  fontSize: '10px',
                  color: '#fff',
                  background: 'var(--gradient-success)',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 12px',
                  fontWeight: 700,
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                }}>
                  מומש
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontWeight: 500,
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    background: 'rgba(108, 99, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <User size={11} color="var(--primary)" />
                  </div>
                  {t.student?.name || 'סטודנט'}
                  {t.student?.studentId && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({t.student.studentId})</span>
                  )}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    background: 'rgba(108, 99, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Calendar size={11} color="var(--text-muted)" />
                  </div>
                  {formatDate(t.createdAt)}
                </span>
              </div>
              {t.voucher?.code && (
                <p style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginTop: '6px',
                  fontFamily: 'monospace',
                  opacity: 0.6,
                  background: 'rgba(108, 99, 255, 0.04)',
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>
                  {t.voucher.code}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}

      {/* Empty State */}
      {transactions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '70px 20px',
          color: 'var(--text-muted)',
          animation: 'fadeInScale 0.6s ease',
        }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(108, 99, 255, 0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            border: '1px solid rgba(108, 99, 255, 0.1)',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <History size={38} color="var(--primary)" style={{ opacity: 0.5 }} />
          </div>
          <p style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>
            אין מימושים עדיין
          </p>
          <p style={{ fontSize: '13px', lineHeight: 1.6 }}>מימושים שתבצע יופיעו כאן</p>
        </div>
      )}
    </div>
  );
}
