import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Users, Mail, GraduationCap, X, Ticket, CheckCircle, Clock, AlertCircle, ChevronLeft, Award, CreditCard, TrendingUp } from 'lucide-react';

const statusConfig = {
  available: { label: 'זמין', color: 'var(--primary)', bg: 'rgba(108, 99, 255, 0.15)' },
  assigned: { label: 'הוקצה', color: '#00c4ff', bg: 'rgba(0, 196, 255, 0.15)' },
  pending_redeem: { label: 'ממתין למימוש', color: '#ffa726', bg: 'rgba(255, 167, 38, 0.15)' },
  redeemed: { label: 'מומש', color: 'var(--success)', bg: 'rgba(0, 196, 140, 0.15)' },
  expired: { label: 'פג תוקף', color: 'var(--danger)', bg: 'rgba(255, 90, 95, 0.15)' },
};

function StudentCardModal({ student, onClose }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(student);

  useEffect(() => {
    userAPI.getStudentVouchers(student._id)
      .then(({ data }) => {
        setStudentData(data.student);
        setVouchers(data.vouchers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [student._id]);

  const totalAssigned = vouchers.length;
  const totalRedeemed = vouchers.filter(v => v.status === 'redeemed').length;
  const totalAmount = vouchers.reduce((sum, v) => sum + v.amount, 0);
  const redeemedAmount = vouchers.filter(v => v.status === 'redeemed').reduce((sum, v) => sum + v.amount, 0);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('he-IL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'var(--bg-overlay, rgba(0, 0, 0, 0.7))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'fadeOverlay 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          maxHeight: '85vh',
          background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.98) 0%, var(--bg-primary) 15%)',
          borderRadius: '28px 28px 0 0',
          overflow: 'hidden',
          animation: 'slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex', flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: 'none',
          boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 20px 0',
          position: 'sticky', top: 0,
          background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.98) 0%, var(--bg-primary) 100%)',
          zIndex: 1,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'var(--primary-light, rgba(108, 99, 255, 0.15))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CreditCard size={20} color="var(--primary)" />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2 }}>כרטיסיית סטודנט</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>פרטים ושוברים</p>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-full, 50%)',
              width: '38px', height: '38px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', transition: 'var(--transition-base, all 0.2s ease)',
              backdropFilter: 'blur(8px)',
            }}>
              <X size={18} />
            </button>
          </div>

          {/* Student Info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '18px',
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(0, 210, 255, 0.05) 100%)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '18px',
            border: '1px solid rgba(108, 99, 255, 0.12)',
            animation: 'fadeIn 0.4s ease 0.1s both',
          }}>
            <div style={{
              width: '58px', height: '58px', borderRadius: 'var(--radius-full, 50%)',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '22px', flexShrink: 0,
              boxShadow: '0 4px 16px rgba(108, 99, 255, 0.3)',
              animation: 'breathe 3s ease-in-out infinite',
            }}>
              {studentData.name?.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>{studentData.name}</p>
              <p style={{
                fontSize: '12px', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '6px',
                  background: 'rgba(108, 99, 255, 0.12)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Mail size={11} color="var(--primary)" />
                </span>
                {studentData.email}
              </p>
              {studentData.studentId && (
                <p style={{
                  fontSize: '12px', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px',
                }}>
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '6px',
                    background: 'rgba(0, 196, 140, 0.12)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <GraduationCap size={11} color="var(--success)" />
                  </span>
                  {studentData.studentId}
                </p>
              )}
            </div>
          </div>

          {/* Stats Row */}
          {!loading && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px',
              marginBottom: '18px',
            }}>
              {[
                { value: totalAssigned, label: 'שוברים', color: 'var(--primary)', bg: 'rgba(108, 99, 255, 0.1)', icon: Ticket, delay: '0.15s' },
                { value: totalRedeemed, label: 'מומשו', color: 'var(--success)', bg: 'rgba(0, 196, 140, 0.1)', icon: CheckCircle, delay: '0.2s' },
                { value: `₪${redeemedAmount}`, label: `מתוך ₪${totalAmount}`, color: '#00c4ff', bg: 'rgba(0, 210, 255, 0.1)', icon: TrendingUp, delay: '0.25s' },
              ].map((stat, idx) => (
                <div key={idx} style={{
                  textAlign: 'center', padding: '14px 8px',
                  background: stat.bg,
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${stat.bg}`,
                  animation: `slideUp 0.35s ease ${stat.delay} both`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: `${stat.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 8px',
                  }}>
                    <stat.icon size={14} color={stat.color} />
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: stat.color, lineHeight: 1.1 }}>{stat.value}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Vouchers section label */}
          {!loading && vouchers.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '14px', paddingBottom: '10px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              animation: 'fadeIn 0.4s ease 0.3s both',
            }}>
              <Ticket size={14} color="var(--text-muted)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>רשימת שוברים</span>
              <span style={{
                fontSize: '11px', fontWeight: 700, color: 'var(--primary)',
                background: 'var(--primary-light, rgba(108, 99, 255, 0.15))',
                padding: '2px 8px', borderRadius: 'var(--radius-full, 20px)',
                marginRight: 'auto',
              }}>{vouchers.length}</span>
            </div>
          )}
        </div>

        {/* Voucher List */}
        <div style={{ padding: '0 20px 24px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}><Loader /></div>
          ) : vouchers.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)',
              animation: 'fadeIn 0.4s ease 0.2s both',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: 'var(--radius-full, 50%)',
                background: 'rgba(108, 99, 255, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Ticket size={32} style={{ opacity: 0.4 }} color="var(--primary)" />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>אין שוברים מוקצים לסטודנט זה</p>
            </div>
          ) : (
            vouchers.map((v, i) => {
              const status = statusConfig[v.status] || statusConfig.available;
              return (
                <div key={v._id} style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '10px',
                  animation: `slideUp 0.3s ease ${0.1 + i * 0.04}s both`,
                  transition: 'var(--transition-base, all 0.2s ease)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: status.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${status.color}22`,
                      }}>
                        <Ticket size={18} color={status.color} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '16px', lineHeight: 1.2 }}>₪{v.amount}</p>
                        <p style={{
                          fontSize: '11px', color: 'var(--text-muted)',
                          fontFamily: 'monospace', marginTop: '2px',
                          background: 'rgba(255,255,255,0.03)',
                          padding: '1px 6px', borderRadius: '4px',
                          display: 'inline-block',
                        }}>{v.code}</p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: 600,
                      color: status.color,
                      background: status.bg,
                      borderRadius: 'var(--radius-full, 10px)',
                      padding: '4px 12px',
                      border: `1px solid ${status.color}20`,
                    }}>
                      {status.label}
                    </span>
                  </div>

                  {v.description && (
                    <p style={{
                      fontSize: '12px', color: 'var(--text-secondary)',
                      marginBottom: '8px', paddingRight: '52px',
                      lineHeight: 1.5,
                    }}>
                      {v.description}
                    </p>
                  )}

                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '12px',
                    fontSize: '11px', color: 'var(--text-muted)',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> הוקצה: {formatDate(v.createdAt)}
                    </span>
                    {v.status === 'redeemed' && (
                      <>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)' }}>
                          <CheckCircle size={11} /> מומש: {formatDate(v.redeemedAt)}
                        </span>
                        {v.redeemedBy && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            אצל: {v.redeemedBy.businessName || v.redeemedBy.name}
                          </span>
                        )}
                      </>
                    )}
                    {v.expiryDate && new Date(v.expiryDate) < new Date() && v.status !== 'redeemed' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger)' }}>
                        <AlertCircle size={11} /> פג תוקף: {formatDate(v.expiryDate)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    userAPI.getStudents()
      .then(({ data }) => setStudents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{
        marginBottom: '28px',
        animation: 'fadeIn 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: 'var(--primary-light, rgba(108, 99, 255, 0.15))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(108, 99, 255, 0.15)',
          }}>
            <Users size={22} color="var(--primary)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 900 }}>סטודנטים</h1>
              <span style={{
                background: 'var(--gradient-primary)',
                color: '#fff',
                borderRadius: 'var(--radius-full, 20px)',
                padding: '3px 14px',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
              }}>
                {students.length}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>ניהול סטודנטים ושוברים</p>
          </div>
        </div>
      </div>

      {/* Student List */}
      {students.map((s, i) => (
        <Card key={s._id} style={{
          marginBottom: '12px',
          animation: `slideUp 0.35s ease ${i * 0.05}s both`,
          cursor: 'pointer',
          transition: 'var(--transition-base, all 0.2s ease)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
        onClick={() => setSelectedStudent(s)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: 'var(--radius-full, 50%)',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '18px', flexShrink: 0,
              boxShadow: '0 4px 14px rgba(108, 99, 255, 0.25)',
            }}>
              {s.name?.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{s.name}</p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '12px', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '6px',
                    background: 'rgba(108, 99, 255, 0.1)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Mail size={11} color="var(--primary)" />
                  </span>
                  {s.email}
                </span>
                {s.studentId && (
                  <span style={{
                    fontSize: '12px', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '6px',
                      background: 'var(--success-light, rgba(0, 196, 140, 0.1))',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <GraduationCap size={11} color="var(--success)" />
                    </span>
                    {s.studentId}
                  </span>
                )}
              </div>
            </div>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              transition: 'var(--transition-base, all 0.2s ease)',
            }}>
              <ChevronLeft size={16} color="var(--text-muted)" />
            </div>
          </div>
        </Card>
      ))}

      {/* Empty State */}
      {students.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)',
          animation: 'fadeIn 0.5s ease 0.2s both',
        }}>
          <div style={{
            width: '88px', height: '88px', borderRadius: 'var(--radius-full, 50%)',
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.12) 0%, rgba(0, 210, 255, 0.08) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            border: '1px solid rgba(108, 99, 255, 0.1)',
            animation: 'pulseSoft 3s ease-in-out infinite',
          }}>
            <Users size={36} color="var(--primary)" style={{ opacity: 0.5 }} />
          </div>
          <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>אין סטודנטים רשומים</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>סטודנטים שיירשמו למערכת יופיעו כאן</p>
        </div>
      )}

      {selectedStudent && (
        <StudentCardModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
